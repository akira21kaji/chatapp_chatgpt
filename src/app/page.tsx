"use client"

import Image from "next/image";
import Sidebar from "./commponents/Sidebar";
import Chat from "./commponents/Chat";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";

export default function Home() {
  const { user, isLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if(!user && !isLoading){
      router.push("/auth/login");
    }
  },[user, router, isLoading]);

  if(isLoading){
    return <div className="flex h-screen justify-center items-center">
      <div className="h-full flex" style={{ width: '1280px' }}>
        <div className="w-full h-full flex justify-center items-center">
          <CgSpinner className="animate-spin text-slate-100 text-4xl" />
        </div>
      </div>
    </div>
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="h-full flex" style={{ width: '1280px' }}>
        <div className="w-1/5 h-full border-r">
          <Sidebar />
        </div>
        <div className="w-4/5 h-full">
          <Chat />
        </div>
      </div>
    </div>
  );
}
