import React, { useEffect } from "react";
import { useAuth } from "@/app/component/authProvider";


interface Message {
  _id: string;
  content: string;
  sender: string;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const { user } = useAuth();

  useEffect(() => {
    console.log("Chat messages chat windows:", messages);
    if (!user?.id) return;
  }, [messages, user]);
  
  return (
    <div className="flex-1 p-4 overflow-auto">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`p-2 mb-2 rounded ${
            msg.sender === "self" ? "bg-blue-100" : msg.sender === "sender" ? "bg-blue-200" : "bg-gray-200"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};
export default ChatWindow;