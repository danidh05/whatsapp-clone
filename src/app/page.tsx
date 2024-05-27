"use client";

import LeftPanel from "@/components/home/left-panel";
import RightPanel from "@/components/home/right-panel";
import { useAuth } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded || !userId) {
    // Optionally render a loading state or null while the authentication status is loading
    return <div>Loading...</div>;
  }

  return (
    <main className='m-5'>
      <div className='flex overflow-y-hidden h-[calc(100vh-50px)] max-w-[1700px] mx-auto bg-left-panel'>
        {/* Green background decorator for Light Mode */}
        <div className='fixed top-0 left-0 w-full h-36 bg-green-primary dark:bg-transparent -z-30' />
        <LeftPanel />
        <RightPanel />
      </div>
    </main>
  );
}
