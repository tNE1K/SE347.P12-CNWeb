"use client";
import React, { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/app/component/authProvider";

interface Message {
  _id: string;
  content: string;
  sender: string;
  recipient: string;
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const socketConnection = io("http://127.0.0.1:5000", {
      query: { user_id: user.id },
      withCredentials: true,
    });

    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Connected to socket server");
    });

    socketConnection.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [user]);

  const sendMessage = async (message: string) => {
    if (!user || !selectedChat) return;

    const newMessage = {
      sender: user.id,
      recipient: selectedChat,
      content: message,
    };

    socket?.emit("send_message", newMessage);

    setMessages((prev) => [...prev, { ...newMessage, _id: Date.now().toString() }]);
  };


  const fetchMessages = async (chat_id: string) => {
    if (!user) return;
    console.log("Fetching messages for chat:", chat_id);
    try {
      const response = await fetch(`http://127.0.0.1:5000/chat/messages?chat_id=${chat_id}`, {
          method: "GET",
          credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const result = await response.json();
      console.log("Result:", result);
      if (result.status === "success" && result.data.messages) {
        const messages = result.data.messages;
        messages.forEach((message: { content: string; timestamp: string; sender: string; recipient: string }) => {
          console.log(`Message from ${message.sender} to ${message.recipient} at ${message.timestamp}: ${message.content}`);
        });
        console.log("Formatter messages: ", messages);
        setMessages(messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  return (
      console.log("messager forward: ", messages),
      <div className="flex h-screen">
      <ChatList onSelectChat={setSelectedChat} />
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
            <>
            <ChatWindow messages={messages} />
            <MessageInput onSendMessage={sendMessage} />
            </>
        ) : (
          <div className="flex h-full justify-center items-center">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}