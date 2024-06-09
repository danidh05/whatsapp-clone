import { ListFilter, LogOut, MessageSquareDiff, Search, User } from "lucide-react"; // Importing icons from the 'lucide-react' library
import { Input } from "../ui/input"; // Importing Input component
import ThemeSwitch from "./theme-switch"; // Importing ThemeSwitch component
import { conversations } from "@/dummy-data/db";
import Conversation from "./conversation";
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const LeftPanel = () => {
    //  const conversations = []; // Placeholder for conversations data

    return (
        // Main container for the left panel, with 1/4 width and right border
        <div className='w-1/4 border-gray-600 border-r'>
            {/* Header section that remains sticky at the top */}
            <div className='sticky top-0 bg-left-panel z-10'>
                {/* Header area containing user icon, message icon, theme switch, and logout icon */}
                <div className='flex justify-between bg-gray-primary p-3 items-center'>
                    <UserButton />

                    <div className='flex items-center gap-3'>
                        <MessageSquareDiff size={20} /> {/* Placeholder for future UserListDialog component */}
                        <ThemeSwitch /> {/* Theme switch component */}
                        <LogOut size={20} className='cursor-pointer' /> {/* Logout icon */}
                    </div>
                </div>

                {/* Search bar area */}
                <div className='p-3 flex items-center'>
                    {/* Container for the search input */}
                    <div className='relative h-10 mx-3 flex-1'>
                        <Search
                            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10'
                            size={18}
                        /> {/* Search icon inside the input */}
                        <Input
                            type='text'
                            placeholder='Search or start a new chat'
                            className='pl-10 py-2 text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent'
                        /> {/* Search input field */}
                    </div>
                    <ListFilter className='cursor-pointer' /> {/* Filter icon */}
                </div>
            </div>

            {/* Container for the chat list, with scrolling enabled */}
            <div className='my-3 flex flex-col gap-0 max-h-[80%] overflow-auto'>
                {/* Rendering conversation items */}
                {conversations.map((conversation) => (
                    <Conversation key={conversation._id} conversation={conversation} />
                ))}
                {/* Message shown when there are no conversations */}
                {conversations?.length === 0 && (
                    <>
                        <p className='text-center text-gray-500 text-sm mt-3'>No conversations yet</p>
                        <p className='text-center text-gray-500 text-sm mt-3 '>
                            We understand {"you're"} an introvert, but {"you've"} got to start somewhere 😊
                        </p>
                    </>
                )}
            </div>
        </div >
    );
};

export default LeftPanel;
