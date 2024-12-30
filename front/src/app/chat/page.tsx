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
    console.log("user", user); 
    const socketConnection = io("http://127.0.0.1:5000", {
      query: { user_id: user.id },
      withCredentials: true,
    });
    setSocket(socketConnection);
    console.log("socketConnection", socketConnection);
    socketConnection.emit("connect_user", user.id);

    socketConnection.on("receive_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [user?.id]);

  const fetchMessages = async (recipient: string) => {
    if (!user?.id) return;
    try {
      const chatListResponse = await fetch(`http://127.0.0.1:5000/chat/list`, {
        method: "GET",
        credentials: "include",
      });

      if (!chatListResponse.ok) {
        throw new Error("Lấy danh sách cuộc trò chuyện thất bại");
      }

      const chatListData = await chatListResponse.json();
      console.log("Danh sách cuộc trò chuyện:", chatListData);

      const response = await fetch(
        `http://127.0.0.1:5000/chat/messages?sender=${user.id}&recipient=${recipient}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Lấy tin nhắn thất bại");
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!user || !selectedChat) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ sender: user.id, recipient: selectedChat, content: message }),
      });

      if (!response.ok) {
        throw new Error("Gửi tin nhắn thất bại");
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, data]);

      if (socket) {
        socket.emit("send_message", data);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    fetchMessages(chatId);
  };

  return (
    <div className="flex h-screen">
      <ChatList onSelectChat={handleChatSelect} />
      <div className="flex flex-1 flex-col">
        {selectedChat ? (
          <>
            <ChatWindow messages={messages} />
            <MessageInput onSendMessage={sendMessage} />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <h2 className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</h2>
          </div>
        )}
      </div>
    </div>
  );
}