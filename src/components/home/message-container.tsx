import ChatBubble from "./chat-bubble";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { useConversationStore } from "@/store/chat-store";
import { useEffect, useRef } from "react";
const MessageContainer = () => {
    const { selectedConversation } = useConversationStore();
    const messages = useQuery(api.messages.getMessages, {
        conversation: selectedConversation!._id,
    });
    const me = useQuery(api.users.getMe);
    const lastMessageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {//This usrEffect is for scrolli
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);//Sometimes in react it wont render and ascroll if we dont have a timeout

    return (
        <div className='relative p-3 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark'>
            <div className='mx-12 flex flex-col gap-3 h-full'>
                {messages?.map((msg, idx) => (
                    <div key={msg._id} ref={lastMessageRef}>
                        <ChatBubble
                            message={msg}
                            me={me}
                            previousMessage={idx > 0 ? messages[idx - 1] : undefined} //To check the previous message ,first 3mnet2kd enno mana awwal msg w3mn3mal check 3ashen 7ott date of convo
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default MessageContainer;
// this MessageContainer component serves as a wrapper for displaying chat messages.
// It loops through the messages array and renders a ChatBubble component for each message,
//ensuring proper styling and organization of the chat interface.