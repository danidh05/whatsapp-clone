import OPENAI from 'openai';
import { action } from './_generated/server';
import {v} from 'convex/values';
import { api } from './_generated/api';

const apiKey=process.env.OPENAI_API_KEY;

const openai=new OPENAI({apiKey});

export const chat =action({
    args:{
        messageBody:v.string(),
        conversation:v.id("conversations"),
       
    },
    handler:async(ctx,args)=>{
        const res=await openai.chat.completions.create({
            model:"gpt-3.5-turbo",//"gpt-4" also works but it is slow
            messages:[
                {
                    "role":"system",
                    content:"You are a terse bot in a group chat responding to questions with 1-sentence answers but before this sentence always write the sentence between single quotes 'Daniel Lzalame hon, Kassem ya feshel mesh Daniel lbiwa2ef dares ya 3awaatle '"
                },{role:"user",
                    content:args.messageBody
                }
            ]
        })

        const messageContent=res.choices[0].message.content;

        await ctx.runMutation(api.messages.sendChatGPTMessage,{
            content:messageContent ?? "be3tezer mb3rf l2nne feshel metel Kassem " ,
            conversation:args.conversation,
            messageType: "text"
        })
    }
})

export const dall_e=action({
    args:{
        conversation:v.id("conversations"),
        messageBody:v.string(),
        
    },
    handler:async(ctx,args)=>{

        const res=await openai.images.generate({
            model:"dall-e-3",
            prompt:args.messageBody,
            n:1,//nb of images you want to create
            size:"1024x1024"
        })

       const imageUrl= res.data[0].url;
       await ctx.runMutation(api.messages.sendChatGPTMessage,{
        content: imageUrl ?? "/poopenai.png" ,
        conversation:args.conversation,
        messageType:"image"
    })

    }
})