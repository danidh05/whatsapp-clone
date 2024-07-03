import {defineSchema,defineTable} from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    users:defineTable({
       name:v.optional(v.string()),
       email:v.string(),
       image:v.string(),
       tokenIdentifier:v.string(),
       isOnline:v.boolean()
    }).index("by_tokenIdentifier",["tokenIdentifier"]),

   conversations:defineTable({
    participants:v.array(v.id("users")),
    isGroup:v.boolean(),
    groupName:v.optional(v.string()),
    groupImage:v.optional(v.string()),
    admin:v.optional(v.id("users"))
   }),


   messages:defineTable({
      conversation:v.id("conversations"),//similat to a fk in SQL
      sender:v.string(),// This should be string and not id so that it doesnt throw an error in open AI part(chatgpt)
      content:v.string(),
      messageType:v.union(v.literal("text"),v.literal("image"),v.literal("video"))//similar to enum(can be either of the 3)

   }).index("by_conversation",["conversation"]),

});