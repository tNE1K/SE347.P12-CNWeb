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

interface UserDetail {
  id: string;
  name: string;
  fullname: string;
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail>();
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const socketConnection = io(`${process.env.MY_API_URL}`, {
      query: {
        user_id: "xxxxxxxxxxxxxxxxxxxx",
        chat_id: "yyyyyyyyyyyyyyyyyyyy",
      },
      withCredentials: true,
      reconnection: true,
    });
    socketConnection.on("connect", () => {
      console.log(`Connected to chat ${selectedChat}`);
    });
  }, []);
  useEffect(() => {
    if (!user?.id) return;

    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`${process.env.MY_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const result = await response.json();
        setUserDetail(result);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetail();
  }, [user]);

  useEffect(() => {
    if (!selectedChat || !user?.id) return;

    const socketConnection = io(`${process.env.MY_API_URL}`, {
      query: { user_id: user.id, chat_id: selectedChat },
      withCredentials: true,
      reconnection: true,
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

  const sendMessage = async (content: string, recipient: string) => {
    if (!user || !selectedChat || !socket) return;

    const newMessage = {
      sender: user.id,
      recipient: recipient,
      content: content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [
      ...prev,
      { ...newMessage, _id: Date.now().toString(), socket },
    ]);
  };

  const fetchMessages = async (chat_id: string) => {
    if (!user) return;
    try {
      const response = await fetch(
        `${process.env.MY_API_URL}/chat/messages?chat_id=${chat_id}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const result = await response.json();
      if (result.status === "success" && result.data.messages) {
        setMessages(result.data.messages);
        console.log("Messages fetched successfully", result.data.messages);
      }

      console.log("Messages fetched successfully", result);
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
    <div className="flex h-screen flex-col">
      <Navbar userDetail={userDetail} />
      <div className="flex flex-1">
        <ChatList onSelectChat={setSelectedChat} />
        <div className="flex flex-1 flex-col">
          {selectedChat ? (
            <>
              <ChatWindow messages={messages} />
              {user?.id && (
                <MessageInput
                  onSendMessage={sendMessage}
                  sender={user.id}
                  recipient={selectedChat}
                  chatId={selectedChat}
                  socket={socket}
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
