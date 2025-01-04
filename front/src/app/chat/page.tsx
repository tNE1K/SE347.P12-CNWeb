"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/app/component/authProvider";
import Navbar from "./components/Navbar";
import Button from "@mui/material/Button";
import { Avatar } from "@mui/material";
import PageviewIcon from "@mui/icons-material/Pageview";
import { blue } from "@mui/material/colors";

interface Message {
  _id: string;
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
  socket: Socket;
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<{
    chatId: string;
    receiverName: string;
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
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
        // No need to set userDetail anymore
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetail();
  }, [user]);

  useEffect(() => {
    if (!selectedChat || !user?.id) return;

    const socketConnection = io(`${process.env.MY_API_URL}`, {
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
    <div className="flex h-screen flex-col">
      <nav className="w-fu l4 border-500 z-10 flex items-center justify-between border-b px-8 py-4">
        <div className="text-2xl font-bold text-blue-700">Messages</div>
        <div className="flex items-center space-x-4 text-lg">
          <span className="text-xl font-semibold">
            {selectedChat?.receiverName}
          </span>
          {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Settings</button> */}
          <Avatar sx={{ bgcolor: blue[700] }}>
            <PageviewIcon />
          </Avatar>
        </div>
      </nav>
      <div className="flex flex-1">
        <ChatList
          onSelectChat={(chatId, receiverName) => {
            setSelectedChat({ chatId, receiverName });
          }}
        />
        <div className="flex flex-1 flex-col">
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
            <div className="flex h-full items-center justify-center">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
