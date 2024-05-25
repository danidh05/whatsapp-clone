import { mutation,query } from "./_generated/server";
import { v } from "convex/values";

export const getProducts=query({
    args:{},
    handler:async(ctx,args)=>{
        const products=await ctx.db.query("products").collect();
        return products;
    }
});



export const addProduct=mutation({
    args:{
        name:v.string(),
        price:v.number()

    },handler:async(ctx,args)=>{
        const productID= await ctx.db.insert("products",{name:args.name, price:args.price})
return productID;
    }
});

export const deleteProducts=mutation({
    args:{
        id: v.id("products")

    },handler:async(ctx,args)=>{
        await ctx.db.delete(args.id)
    }

})