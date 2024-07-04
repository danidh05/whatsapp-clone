import { IMessage } from "@/store/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type ChatBubbleAvatar = {
    message: IMessage;
    isMember: boolean;
    isGroup: boolean | undefined;
}

const ChatBubbleAvatar = ({ isGroup, isMember, message }: ChatBubbleAvatar) => {
    if (!isGroup) {
        return null;
    }
    return (
        <Avatar className="overflow-visible relative">{/*To show if this member is online or not */}
            {message.sender.isOnline && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-foreground" />
            )}
            <AvatarImage src={message.sender?.image} className="rounded-full object-cover w-8 h-8" />
            <AvatarFallback className="w-8 h-8">
                <div className="animate-pulse bg-grey-tertiary rounded-full"></div>
                {/*To show the profile avatar of the user that sent the msg */}

            </AvatarFallback>
        </Avatar>
    )

    return (
        <div>ChatBubbleAvatar</div>
    );
}

export default ChatBubbleAvatar;
