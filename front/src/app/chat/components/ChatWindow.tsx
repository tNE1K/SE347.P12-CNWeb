import React, { useEffect } from "react";
import { useAuth } from "@/app/component/authProvider";

interface Message {
  _id: string;
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return; 
  }, [messages, user]);
  // console.log("Chat messages chat windows:", messages);
  return (
    <div className="flex-1 p-4 overflow-auto flex flex-col">
      {messages.map((msg, index) => (
        <div
          key={msg._id || `message-${index}`}
          className={`p-2 mb-2 rounded max-w-xs ${
            msg.sender === user?.id
              ? "bg-blue-100 self-end"
              : "bg-gray-200 self-start"
          }`}
        >
          <div>{msg.content}</div>
            <p className="text-xs text-right">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
