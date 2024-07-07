import { IMessage, useConversationStore } from "@/store/chat-store"
import { api } from "../../../convex/_generated/api";
import { kickUser } from "convex/conversations";
import { useMutation } from "convex/react";
import { Ban, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { create } from "domain";
import { from } from "svix/dist/openapi/rxjsStub";

type ChatAvatarActionProps = {
    message: IMessage;
    me: any;
}
const ChatAvatarActions = ({ me, message }: ChatAvatarActionProps) => {
    const { selectedConversation, setSelectedConversation } = useConversationStore();
    const isMember = selectedConversation?.participants.includes(message.sender._id);
    const kickUser = useMutation(api.conversations.kickUser);
    const createConversation = useMutation(api.conversations.createConversation);
    const fromAI = message.sender?.name === "ChatGPT";
    const isGroup = selectedConversation?.isGroup;


    const handleKickUser = async (e: React.MouseEvent) => {
        if (fromAI) return;

        e.stopPropagation();//we use this,3ashen ken lamma 23mal kick la7aalo y3mal redirect bala ma ekbs 3l esm
        if (!selectedConversation) return;
        try {
            await kickUser({
                conversationId: selectedConversation._id,
                userId: message.sender._id
            })
            setSelectedConversation({
                ...selectedConversation,
                participants: selectedConversation.participants.filter((id) => id !== message.sender._id)
            })//we kicked the user from the participants of the group

        } catch (error) {
            toast.error("Failed to kick user");

        }
    }

    const handleCreateConversation = async () => {
        if (fromAI) return;
        try {
            const conversationId = await createConversation({
                isGroup: false,
                participants: [me._id, message.sender._id]
            })
            setSelectedConversation({
                _id: conversationId,
                name: message.sender.name,
                participants: [me._id, message.sender._id],
                isGroup: false,
                isOnline: message.sender.isOnline,
                image: message.sender.image
            })

        } catch (error) {
            toast.error("failed to create conversation")
        }
    }//if there is already a convo with this person redirect me to there,If there is not then create a new one with this user
    return (
        <div
            className="text-[11px] flex gap-4 justify-between font-bold cursor-pointer group"
            onClick={handleCreateConversation}
        >
            {isGroup && message.sender.name}

            {!isMember && !fromAI && isGroup && <Ban size={16} className="text-red-500" />}
            {isGroup && isMember && selectedConversation?.admin === me._id && (
                <LogOut size={16} className="text-red-500 opacity-0 group-hover:opacity-100"
                    onClick={handleKickUser} />
            )}

        </div>
    )
}

export default ChatAvatarActions