import React, { useEffect, useRef } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const userMessages = messages.filter((msg) => msg.sender === user?.id);

  useEffect(() => {
    if (!user?.id) return;
  }, [messages, user]);

  // console.log("Chat messages chat windows:", messages);
  return (
    <div className="flex-1 p-4 overflow-auto flex flex-col max-h-[calc(85vh)]">
      {messages.map((msg, index) => (
        <div
          key={msg._id || `message-${index}`}
          className={`p-2 mb-2 rounded max-w-xs break-words ${
            msg.sender === user?.id
              ? "bg-blue-100 self-end"
              : "bg-gray-200 self-start"
          }`}
          style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
        >
          {msg.content}
          <p
          className={`text-xs ${
            msg.sender === user?.id ? "text-right" : "text-left"
          }`}
        >
          {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;