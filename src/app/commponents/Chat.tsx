"use client"

import { useAppContext } from '@/context/AppContext';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import {  FaPaperPlane } from 'react-icons/fa'
import { db } from '../../../firebase';
import OpenAI from "openai"
import LoadingIcons from 'react-loading-icons'


type Message = {
  text: string;
  createdAt: Timestamp;
  sender: string;
}

const Chat = () => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const { selectedRoom,selectedRoomName } = useAppContext();
  const[ inputMessage,setInputMessage] = useState<string>("")
  const [messages,setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scrollDiv = useRef<HTMLDivElement>(null);

  const SendMessage = async() => {
    if(!inputMessage.trim() || !selectedRoom) return;

    const messageData = {
      text: inputMessage,
      createdAt: serverTimestamp(),
      sender: "user",
    }

    const roomDocRef = doc(db,"rooms",selectedRoom);
    const messageCollectionRef = collection(roomDocRef,"messages");
    await addDoc(messageCollectionRef, messageData);

    setInputMessage("");
    setIsLoading(true);

    const gptResponse = await openai.chat.completions.create({
      messages: [{role: "user", content: inputMessage}],
      model: "gpt-3.5-turbo",
    });

    setIsLoading(false);

    const botResponse = gptResponse.choices[0].message.content;
    await addDoc(messageCollectionRef,{
      text: botResponse,
      sender: "bot",
      createdAt: serverTimestamp(),
    });
    setInputMessage("");
    setIsSending(false);
  };

  useEffect(() => {
    if(selectedRoom){
			const fetchMessages = async () =>{
				const roomDocRef = doc(db,'rooms', selectedRoom);
				const messageCollectionRef = collection(roomDocRef,"messages");

        const q = query(messageCollectionRef, orderBy("createdAt"));

				const unsubscribe = onSnapshot(q,(snapshot) => {
					const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
          setMessages(newMessages);
				});

				return () => {
					unsubscribe();
				}
			};
			fetchMessages();
		}
  },[selectedRoom])

  useEffect(() => {
    if(scrollDiv.current){
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      })
    }
  },[messages])

  return (
    <div className='bg-gray-500 h-full p-4 flex flex-col'>
      <h1 className='text-2xl text-white font-semibold mb-4'>{selectedRoomName}</h1>
      <div className='flex-grow overflow-y-auto mb-4' ref={scrollDiv}>
        {messages.map((message,index) => (
            <div key={index} className={message.sender === "user" ? "text-right" : "text-left"}>
              <div className={
                message.sender === "user"
                ? "bg-blue-500 inline-block rounded px-4 py-2 mb-2"
                : "bg-green-500 inline-block rounded px-4 py-2 mb-2"
               }
               >
                <p className='text-white'>{message.text}</p>
               </div>
            </div>
        ))}
        {isLoading && <LoadingIcons.TailSpin className='text-white' />}
      </div>

      <div className='flex-shrink-0 relative'>
        <input 
          type="text"
          placeholder='send a Message' 
          className='border-2 rounded w-full pr-10 focus:outline-none p-2'
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          onKeyDown={(e) => {
            if(e.key === "Enter"){
              SendMessage();
            }
          }}
        />
        <button
         className='absolute inset-y-0 right-4 flex items-center'
         onClick={SendMessage}
         disabled={isSending}
        >
          <FaPaperPlane className='text-gray-500' />
        </button>
      </div>
    </div>
  )
}

export default Chat