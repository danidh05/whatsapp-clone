import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ImageIcon, MessageSquareDiff } from "lucide-react";
import { users } from "@/dummy-data/db";
import { Id } from "convex/_generated/dataModel";
import { createConversation } from "convex/conversations";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { DialogClose } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";

const UserListDialog = () => {
    const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
    const [groupName, setGroupName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);//image lmna2iha
    const [renderedImage, setRenderedImage] = useState("");//lezm l selected tsiir rendered 

    const imgRef = useRef<HTMLInputElement>(null);
    const dialogCloseRef = useRef<HTMLButtonElement>(null);

    const createConversation = useMutation(api.conversations.createConversation);
    const generateUploadUrl = useMutation(api.conversations.generateUploadUrl)

    const me = useQuery(api.users.getMe);
    const users = useQuery(api.users.getUsers)
    const handleCreateConversation = async () => {
        if (selectedUsers.length === 0) return;
        setIsLoading(true);
        try {
            const isGroup = selectedUsers.length > 1;//check if the chat is group or not
            let conversationId;
            if (!isGroup) {
                conversationId = await createConversation({
                    participants: [...selectedUsers, me?._id!],
                    isGroup: false
                })

            } else {//For group chats
                const postUrl = await generateUploadUrl();//we gen a url ,where the img will be stored(in server)

                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": selectedImage?.type! },
                    body: selectedImage
                })

                const { storageId } = await result.json();
                await createConversation({
                    participants: [...selectedUsers, me?._id!],
                    isGroup: true,
                    admin: me?._id!,
                    groupName,
                    groupImage: storageId
                })


            }
            dialogCloseRef.current?.click();
            setSelectedUsers([]);
            setGroupName("");
            setSelectedImage(null);

            //TODO=>UPDATE a global state called "selectedConversation"
        } catch (err) {
            toast.error("Faied to create conversation")
            console.error(err)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!selectedImage) return setRenderedImage("");
        const reader = new FileReader();
        reader.onload = (e) => setRenderedImage(e.target?.result as string);
        reader.readAsDataURL(selectedImage);//   // Start reading the selected image file as a data URL
    }, [selectedImage]);//here the rendered image will become the selected one
    return (
        <Dialog>
            <DialogTrigger>
                <MessageSquareDiff size={20} />
            </DialogTrigger>
            {/* DialogTrigger is the one holding the button my left panel */}
            <DialogContent>
                <DialogHeader>
                    {/* TODO: <DialogClose /> will be here */}
                    <DialogClose />
                    <DialogTitle>USERS</DialogTitle>
                </DialogHeader>

                <DialogDescription>Start a new chat</DialogDescription>
                {renderedImage && (
                    <div className='w-16 h-16 relative mx-auto'>
                        <Image src={renderedImage} fill alt='user image' className='rounded-full object-cover' />
                    </div>
                )}
                {/* TODO: input file */}
                <input
                    type="file"
                    accept="image/*"
                    ref={imgRef}
                    hidden
                    onChange={(e) => setSelectedImage(e.target.files![0])}//I Am sure value is non null ,so I put !
                />

                {selectedUsers.length > 1 && (
                    // If I have more than 1 selected user I aam creating a group
                    <>
                        <Input
                            placeholder='Group Name'
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <Button className='flex gap-2' onClick={() => imgRef.current!.click()}>
                            <ImageIcon size={20} />
                            Group Image
                        </Button>
                    </>
                )}
                <div className='flex flex-col gap-3 overflow-auto max-h-60'>
                    {users?.map((user) => (
                        <div
                            key={user._id}
                            className={`flex gap-3 items-center p-2 rounded cursor-pointer active:scale-95 
								transition-all ease-in-out duration-300
							${selectedUsers.includes(user._id) ? "bg-green-primary" : ""}`}
                            onClick={() => {
                                if (selectedUsers.includes(user._id)) {
                                    setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
                                } else {
                                    setSelectedUsers([...selectedUsers, user._id]);
                                }
                            }} //Here we either add the user to the state or remove it on the click(eza ken selected bisiir unselected and vise versa)
                        >
                            <Avatar className='overflow-visible'>
                                {user.isOnline && (
                                    <div className='absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-foreground' />
                                )}

                                <AvatarImage src={user.image} className='rounded-full object-cover' />
                                <AvatarFallback>
                                    <div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full'></div>
                                </AvatarFallback>
                            </Avatar>

                            <div className='w-full '>
                                <div className='flex items-center justify-between'>
                                    <p className='text-md font-medium'>{user.name || user.email.split("@")[0]}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* For each user we are returning an avatar and a username */}

                </div>
                <div className='flex justify-between'>
                    <Button variant={"outline"}>Cancel</Button>
                    <Button
                        onClick={handleCreateConversation}
                        disabled={selectedUsers.length === 0 || (selectedUsers.length > 1 && !groupName) || isLoading}
                    >
                        {/* spinner,IF loading  is true I get a spinner otherwise the word create */}
                        {isLoading ? (
                            <div className='w-5 h-5 border-t-2 border-b-2  rounded-full animate-spin' />
                        ) : (
                            "Create"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default UserListDialog;