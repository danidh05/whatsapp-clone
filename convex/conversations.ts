import { ConvexError, v } from "convex/values"
import { mutation,query } from "./_generated/server"


export const createConversation=mutation({
    args:{
        participants:v.array(v.id("users")),
        isGroup:v.boolean(),
        groupName:v.optional(v.string()),
        groupImage:v.optional(v.id("_storage")),//because we are going to save the image in the storage and take its id
        admin:v.optional(v.id("users"))
    },//args passed into the mutation
    handler:async(ctx,args)=>{
        const identity=await ctx.auth.getUserIdentity();//check the identity of the user,if unauthenticated throw an error
        if(!identity) throw new ConvexError("Unauthorized");


        const existingConversation=await ctx.db.query("conversations")
        .filter(q=>q.or(
            q.eq(q.field("participants"),args.participants),
            q.eq(q.field("participants"),args.participants.reverse())
            //Queries the "conversations" collection in the database to check if a conversation with the exact same participants already exists
            //[Daniel,Wassim]
            //[Wassim,Daniel] ,men 3nde l3ndo wmen 3ndo l3nde I check both
        )
    )
    .first();

    if(existingConversation){
        return existingConversation._id;
        //If an existing conversation is found, it returns the ID of that conversation.
    }
    let groupImage;

    if(args.groupImage){
        groupImage=(await ctx.storage.getUrl(args.groupImage)) as string;
    }//if there is an image retrieve its url and save it

    const conversationId=await ctx.db.insert("conversations",{
        participants:args.participants,
        isGroup:args.isGroup,
        groupName:args.groupName,
        groupImage,//groupImage will be saved in the database here
        admin:args.admin
    })//create new one if not available
    return conversationId;
//This mutation check if theres already a prev convo with this person dont make a new convo
    }
});

export const getMyConversations= query({
//This query is used to see the last message with the chat ,and the user details such as the groups picture or the other user's profile picture
    
    args:{},//This specifies that the getMyConversations query does not take any arguments.
    handler:async(ctx,args)=>{// handles the query logic
        const identity=await ctx.auth.getUserIdentity();//checks if the user is authenticated.
        if(!identity) throw new ConvexError("Unauthorized");

        const user=await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier",q=>q.eq("tokenIdentifier",identity.tokenIdentifier))
        .unique();  
        //This query looks for a user in the users collection whose tokenIdentifier matches the authenticated user's tokenIdentifier

        if(!user) throw new ConvexError("User not found");
        const conversations=await ctx.db.query("conversations").collect();//we took all convs from db

        const myConversations=conversations.filter((conversation)=>{
            return conversation.participants.includes(user._id);
        });//we filter them and take only the user's ones
      const conversationsWithDetails = await Promise.all(
        myConversations.map(async(conversation)=>{

            let userDetails={};
            if(!conversation.isGroup){
                const otherUserId= conversation.participants.find(id=>id!==user._id);
                const userProfile = await ctx.db.query("users")
                .filter(q=>q.eq(q.field("_id"),otherUserId))
                .take(1);//Takes only the first result from the query

                userDetails=userProfile[0];
            }

            const lastMessage=await ctx.db
            .query("messages")
            .filter((q)=>q.eq(q.field("conversation"),conversation._id))//This condition means "find documents where the conversation field equals conversation._id."

            //q is a query builder object provided by Convex
            //This part specifies the field in the documents to be filtered on. 
            //Here, q.field("conversation") indicates that the filtering should be done on the conversation field of the documents.
            
            .order("desc")
            .take(1)

            return{
                ...userDetails,
                ...conversation,
                lastMessage:lastMessage[0] || null,
            }//return should be in this order otherwise _id field will be overwritten
        })
      )
        return conversationsWithDetails;

    }
})

export const kickUser=mutation({
args:{conversationId:v.id("conversations"),
      userId:v.id("users")
},
handler:async(ctx,args)=>{
    const identity=await ctx.auth.getUserIdentity();
    if(!identity){
        throw new ConvexError("Unauthorized");    
    }

    const conversation=await ctx.db
    .query("conversations")
    .filter((q)=>q.eq(q.field("_id"),args.conversationId))
    .unique();

    if(!conversation) throw new ConvexError("conversation not found");

    if (!conversation.participants || !Array.isArray(conversation.participants)) {
        throw new ConvexError("Participants not found in conversation");
      }

    await ctx.db.patch(args.conversationId,{
        participants:conversation.participants.filter((id)=>id!==args.userId)
    })//meaningg this function will remove the user with the id provided as an arg from the group(user kicked)
}
});

export const generateUploadUrl =mutation(async (ctx)=>{
    return await ctx.storage.generateUploadUrl(); 
});