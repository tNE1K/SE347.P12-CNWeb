"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/app/component/authProvider";
import Navbar from "./components/Navbar";

interface Message {
  _id: string;
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
  socket: Socket;
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<{ chatId: string; receiverName: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const result = await response.json();
        // No need to set userDetail anymore
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetail(); 
  }, [user]);

  useEffect(() => {
    if (!selectedChat || !user?.id) return;
    
    const socketConnection = io("http://127.0.0.1:5000", {
      query: { user_id: user.id, chat_id: selectedChat.chatId },
      withCredentials: true,
      reconnection: true, 
    });

    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log(`Connected to chat ${selectedChat.chatId}`);
    });

    socketConnection.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketConnection.disconnect();
      setSocket(null);
    };
  }, [selectedChat, user]);

  const sendMessage = async (content: string, recipient: string) => {
    if (!user || !selectedChat || !socket) return;

    const newMessage = {
      sender: user.id,
      recipient: recipient,
      content: content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, { ...newMessage, _id: Date.now().toString(), socket }]);
  };

  const fetchMessages = async (chat_id: string) => {
    if (!user) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/chat/messages?chat_id=${chat_id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const result = await response.json();
      if (result.status === "success" && result.data.messages) {
        setMessages(result.data.messages);
      }

    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.chatId);
    }
  }, [selectedChat]);

  return (
    <div className="flex flex-col h-screen">  
      <nav className="z-10 flex w-full items-center justify-between border-b border-gray-200 py-4 px-8">
        <div className="text-2xl font-bold">Messages</div>
        <div className="text-lg flex items-center space-x-4">
          <span>{selectedChat?.receiverName}</span>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Settings</button>
        </div>
      </nav>
      <div className="flex flex-1">
        <ChatList onSelectChat={(chatId, receiverName) => {
          setSelectedChat({ chatId, receiverName });
        }} />
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
          <>
            <ChatWindow messages={messages} />
            {user?.id && (
            <MessageInput
              onSendMessage={(content, recipient) => {
              sendMessage(content, recipient);
              }}
              sender={user.id}
              recipient={selectedChat.chatId}
              chatId={selectedChat.chatId}
              socket={socket}
            />
            )}
          </>
          ) : (
          <div className="flex h-full justify-center items-center">
            Select a chat to start messaging
          </div>
          )}
        </div>
      </div>
    </div>
  );
}