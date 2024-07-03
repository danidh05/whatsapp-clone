import { formatDate } from "@/lib/utils"; // Importing formatDate function from utils
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"; // Importing avatar components
import { MessageSeenSvg } from "@/lib/svgs"; // Importing MessageSeenSvg component
import { ImageIcon, Users, VideoIcon } from "lucide-react"; // Importing icons from lucide-react library
import { useQuery, } from "convex/react";
import { api } from "../../../convex/_generated/api";
// Conversation Component Definition
const Conversation = ({ conversation }: { conversation: any }) => {
    // Destructuring conversation data
    const conversationImage = conversation.groupImage || conversation.image; // Extracting group image from conversation
    const conversationName = conversation.groupName || conversation.name; // Extracting group name from conversation, defaulting to "Private Chat"
    const lastMessage = conversation.lastMessage; // Extracting last message from conversation
    const lastMessageType = lastMessage?.messageType; // Extracting message type from last message
    const me = useQuery(api.users.getMe);
    return (
        // Conversation JSX
        <>
            <div className={`flex gap-2 items-center p-3 hover:bg-chat-hover cursor-pointer `}>
                <Avatar className='border border-gray-900 overflow-visible relative'> {/* Avatar container */}
                    {conversation.isOnline && ( // Render green dot if user is online
                        <div className='absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-foreground' />
                    )}
                    <AvatarImage src={conversationImage || "/placeholder.png"} className='object-cover rounded-full' /> {/* Avatar image */}
                    <AvatarFallback> {/* Placeholder for avatar image */}
                        <div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full'></div>
                    </AvatarFallback>
                </Avatar>
                <div className='w-full'>
                    <div className='flex items-center'>
                        <h3 className='text-xs lg:text-sm font-medium'>{conversationName}</h3> {/* Conversation name */}
                        <span className='text-[10px] lg:text-xs text-gray-500 ml-auto'>
                            {formatDate(lastMessage?._creationTime || conversation._creationTime)} {/* Last message creation time */}
                        </span>
                    </div>
                    <p className='text-[12px] mt-1 text-gray-500 flex items-center gap-1 '>
                        {lastMessage?.sender === me?._id ? <MessageSeenSvg /> : ""} {/* Message seen icon */}
                        {conversation.isGroup && <Users size={16} />} {/* Group icon if it's a group chat */}
                        {!lastMessage && "Say Hi!"} {/* Placeholder for "Say Hi!" message */}
                        {lastMessageType === "text" ? ( // Conditional rendering based on message type
                            lastMessage?.content.length > 30 ? ( // Truncate message content if longer than 30 characters
                                <span className='text-xs'>{lastMessage?.content.slice(0, 30)}...</span>
                            ) : (
                                <span className='text-xs'>{lastMessage?.content}</span>
                            )
                        ) : null}
                        {lastMessageType === "image" && <ImageIcon size={16} />} {/* Render image icon if message type is image */}
                        {lastMessageType === "video" && <VideoIcon size={16} />} {/* Render video icon if message type is video */}
                    </p>
                </div>
            </div>
            <hr className='h-[1px] mx-10 bg-gray-primary' /> {/* Horizontal separator */}
        </>
    );
};

export default Conversation; // Exporting Conversation component

//In summary, this component renders a styled conversation item,
//including avatar, conversation details, and last message information,
//with appropriate icons and formatting based on the message type and status.
