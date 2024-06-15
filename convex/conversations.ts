import { ConvexError, v } from "convex/values"
import { mutation } from "./_generated/server"


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
})

export const generateUploadUrl =mutation(async (ctx)=>{
    return await ctx.storage.generateUploadUrl(); 
});