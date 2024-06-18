"use client"

import { onAuthStateChanged, User } from "firebase/auth";
import { ReactNode, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { auth } from "../../firebase";

type AppProviderProps = {
  children: ReactNode;
}

type AppContextType = {
  user: User | null;
  userId: string | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  selectedRoom: string | null,
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>,
  selectedRoomName: string | null,
  setSelectedRoomName: React.Dispatch<React.SetStateAction<string | null>>,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

const defaultContextData = {
  user: null,
  userId: null,
  setUser: () => {},
  selectedRoom: null,
  setSelectedRoom: () => {},
  selectedRoomName: null,
  setSelectedRoomName: () => {},
  isLoading: true,
  setIsLoading: () => {},
}

const AppContext = createContext<AppContextType>(defaultContextData);

export function AppProvider({children}: AppProviderProps){
  const [user,setUser] = useState<User | null>(null);
  const [userId,setUserId] = useState<string | null>(null);
  const [selectedRoom,setSelectedRoom] = useState<string | null>(null);
  const [selectedRoomName,setSelectedRoomName] = useState<string | null>(null);
  const [isLoading,setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,(newUser) => {
      setUser(newUser)
      setUserId(newUser? newUser.uid : null)
      setIsLoading(false);
    });

    return() => {
      unsubscribe();
    }
  },[])

  return(
    <AppContext.Provider 
      value={{user,userId,setUser,selectedRoom,setSelectedRoom,selectedRoomName,setSelectedRoomName,isLoading,setIsLoading}}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(){
  return useContext(AppContext);
}