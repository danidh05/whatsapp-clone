import { messages } from "@/src/dummy-data/db";
import ChatBubble from "./chat-bubble";
const MessageContainer = () => {
    return (
        <div className='relative p-3 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark'>
            <div className='mx-12 flex flex-col gap-3 h-full'>
                {messages?.map((msg, idx) => (
                    <div key={msg._id}>
                        <ChatBubble />
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