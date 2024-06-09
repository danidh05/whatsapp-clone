import { ConvexError, v } from "convex/values";
import { internalMutation,query } from "./_generated/server";

export const createUser=internalMutation({
    args:{
        tokenIdentifier:v.string(),
        email:v.string(), 
        name: v.string(),
        image:v.string()

    },
    handler:async(ctx,args)=>{
        await ctx.db.insert("users",{
            tokenIdentifier:args.tokenIdentifier,
            email:args.email,
            name:args.name,
            image:args.image,
            isOnline:true
        })
    }
});
export const updateUser = internalMutation({
	args: { tokenIdentifier: v.string(), image: v.string() },
	async handler(ctx, args) {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		await ctx.db.patch(user._id, {
			image: args.image,
		});
	},
});

export const setUserOnline = internalMutation({
	args: { tokenIdentifier: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		await ctx.db.patch(user._id, { isOnline: true });
	},
});

export const setUserOffline = internalMutation({
    // Define the arguments that this mutation takes.
    args: { tokenIdentifier: v.string() },
    
    // Define the handler function that contains the logic for the mutation.
    handler: async (ctx, args) => {
      // Query the "users" table to find a user with the specified tokenIdentifier.
      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", args.tokenIdentifier))//index is specified in your schema
        .unique();
  
      // If no user is found, throw an error.
      if (!user) {
        throw new ConvexError("user not found");
      }
  
      // Update the user's `isOnline` status to `false`.
      await ctx.db.patch(user._id, { isOnline: false });
    }
  });

  export const getUsers=query({
    args:{},
    handler:async(ctx,args)=>{
      const identity= await ctx.auth.getUserIdentity();
      if(!identity){
        throw new ConvexError("Unauthorized");
      }

      const users=await ctx.db.query("users").collect();
       return users;
       //retrieve and return all user records from users table
    }
  })

export const getMe=query({
  args:{},
  handler:async(ctx,args)=>{
    const identity= await ctx.auth.getUserIdentity();
    if(!identity){
      throw new ConvexError("Unauthorized");
    }

    const user=await ctx.db.query("users")
    .withIndex("by_tokenIdentifier",q=>q.eq("tokenIdentifier",identity.tokenIdentifier))
    .unique();
    
    if(!user){
      throw new ConvexError("User not found");
    }
    return user;
  }
})
//TODO add getGroupUsers query
  