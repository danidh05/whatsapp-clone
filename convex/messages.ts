import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const sendTextMessage = mutation({
    args:{
        sender:v.string(),
        content:v.string(),
        conversation:v.id("conversations")
    },
    handler:async(ctx,args)=>{
        const identity =await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("unauthenticated");
        }

        const user=await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier",(q)=>q.eq("tokenIdentifier",identity.tokenIdentifier))
        .unique();

        if(!user){
            throw new ConvexError("User not found");
        }

        const conversation=await ctx.db.query("conversations")
        .filter(q=>q.eq(q.field("_id"),args.conversation))
        .first();

        if(!conversation){
            throw new ConvexError("Conversation not found");

        }
        if(!conversation.participants.includes(user._id)){
            throw new ConvexError("You are not part of this conversation")
        }
        //find if user is part of the convo
        await ctx.db.insert("messages",{
            sender:args.sender,
            content:args.content,
            conversation:args.conversation,
            messageType:"text"
        });


        //TODO => add gpt support later
    }
});

//Optimized-->here we will store them in the cache.The cache size depends on the machine with memory
export const getMessages=query({
    args:{
        conversation:v.id("conversations")
    },
    handler:async(ctx,args)=>{
        const identity =await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("Not authorized");
        }
        const messages=await ctx.db
         .query("messages") 
         .withIndex("by_conversation",(q)=>q.eq("conversation",args.conversation))
         .collect();

         const userProfileCache =new Map();

         const messagesWithSender =await Promise.all(
            messages.map(async(message)=>{
                let sender;
                //check if sender profile is in cache
                if(userProfileCache.has(message.sender)){
                    sender=userProfileCache.get(message.sender)
                }else{
                    //Fetch sender profile from database

                    sender=await ctx.db
                    .query("users")
                    .filter((q)=>q.eq(q.field("_id"),message.sender))
                    .first();
                    //cache yhe sender profile
                    userProfileCache.set(message.sender,sender)

                }
                return{...message,sender};

            })

         );
         return messagesWithSender;

 
    }
})




//This is unoptimized version
//Because lets consider John sent 200 messages ,Here we are trying to get the sender for each message
//However what we should do is take the sender only once no matter how many messages he sent.So we are going to use a hash map
// export const getMessages=query({
//     args:{
//         conversation:v.id("conversations")
//     },
//     handler:async(ctx,args)=>{
//         const identity = await ctx.auth.getUserIdentity();
//         if(!identity){
//             throw new ConvexError("not authenticated");
//         }
      
//         const messages=await ctx.db
//         .query("messages")
//         .withIndex("by_conversation",q=>q.eq("conversation",args.conversation))
//         .collect();

//         const messagesWithSender = await Promise.all(
//             messages.map(async (message)=>{
//                 const sender =await ctx.db.query("users")
//                 .filter(q=>q.eq(q.field("_id"),message.sender))
//                 .first();


//                 return {...message,sender}
//             })
//         )
//         return messagesWithSender;


//     }

// })