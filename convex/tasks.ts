// Import the query and mutation functions from Convex server library
import { query, mutation } from './_generated/server';
// Import the value validation functions from Convex values library
import { v } from 'convex/values';

// Define a query to get all tasks from the "tasks" table
export const getTasks = query({
    // No arguments are required for this query
    args: {},
    // The handler function is asynchronous and takes context (ctx) and arguments (args)
    handler: async (ctx, args) => {
        // Fetch all tasks from the "tasks" table and collect them into an array
        const tasks = await ctx.db.query("tasks").collect();
        // Return the array of tasks
        return tasks;
    }
});

// Define a mutation to add a new task to the "tasks" table
export const addTask = mutation({
    // Specify that this mutation requires a single argument: text (string)
    args: {
        text: v.string()
    },
    // The handler function is asynchronous and takes context (ctx) and arguments (args)
    handler: async (ctx, args) => {
        // Insert a new task into the "tasks" table with the provided text and completed set to false
        const taskId = await ctx.db.insert("tasks", { text: args.text, completed: false });
        // Return the ID of the newly created task
        return taskId;
    },
});

// Define a mutation to mark a task as completed
export const completeTask = mutation({
    // Specify that this mutation requires a single argument: id (an ID referring to a task in the "tasks" table)
    args: {
        id: v.id("tasks")
    },
    // The handler function is asynchronous and takes context (ctx) and arguments (args)
    handler: async (ctx, args) => {
        // Update the specified task by setting its completed field to true
        await ctx.db.patch(args.id, { completed: true });
    }
});

// Define a mutation to delete a task from the "tasks" table
export const deleteTask = mutation({
    // Specify that this mutation requires a single argument: id (an ID referring to a task in the "tasks" table)
    args: {
        id: v.id("tasks")
    },
    // The handler function is asynchronous and takes context (ctx) and arguments (args)
    handler: async (ctx, args) => {
        // Delete the specified task from the "tasks" table
        await ctx.db.delete(args.id);
    }
});
