"use client";
import React, { useEffect, useState } from "react";
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
}

interface UserDetail {
  id: string;
  name: string;
  fullname: string;
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | undefined>(undefined);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`"${process.env.MY_API_URL}/auth/me"`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const result = await response.json();
        setUserDetail(result.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetail();
  }, [user]);

  useEffect(() => {
    if (!selectedChat || !user?.id) return;

    // Connect to socket server when a chat is selected
    const socketConnection = io(`"${process.env.MY_API_URL}"`, {
      query: { user_id: user.id, chat_id: selectedChat },
      withCredentials: true,
    });

    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log(`Connected to chat ${selectedChat}`);
    });

    socketConnection.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketConnection.disconnect();
      setSocket(null);
    };
  }, [selectedChat, user]);

  const sendMessage = async (message: string) => {
    if (!user || !selectedChat || !socket) return;

    const newMessage = {
      sender: user.id,
      recipient: selectedChat,
      content: message,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", newMessage, (response: { status: string }) => {
      if (response.status === "success") {
        console.log("Message sent successfully");
      } else {
        console.error("Failed to send message");
      }
    });

    setMessages((prev) => [...prev, { ...newMessage, _id: Date.now().toString() }]);
  };

  const fetchMessages = async (chat_id: string) => {
    if (!user) return;
    try {
      const response = await fetch(`${process.env.MY_API_URL}/chat/messages?chat_id=${chat_id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const result = await response.json();
      if (result.status === "success" && result.data.messages) {
        setMessages(result.data.messages);
        console.log("Messages fetched successfully", result.data.messages);       }
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
    <div className="flex flex-col h-screen">
      <Navbar userDetail={userDetail} />
      <div className="flex flex-1">
        <ChatList onSelectChat={setSelectedChat} />
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <ChatWindow messages={messages} />
              {user?.id && (
                <MessageInput
                  onSendMessage={sendMessage}
                  sender={user.id}
                  recipient={selectedChat}
                  chatId={selectedChat}
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
