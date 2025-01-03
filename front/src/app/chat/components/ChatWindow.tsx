import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/component/authProvider";
import CircularProgress from "@mui/material/CircularProgress";


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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <CircularProgress />
        </div>
      );
    }

  return (
    console.log("ChatWindow"),
    <div
      className="flex-1 p-4 overflow-y-auto flex flex-col"
      style={{
        maxHeight: "calc(90vh - 4rem)", 
        height: "auto",
        overflowX: "hidden",
      }}
    >
      {messages.map((msg, index) => (
        <div
          key={msg._id || `message-${index}`}
          className={`p-2 mb-2 rounded max-w-xs break-words ${
            msg.sender === user?.id ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
          }`}
          style={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            wordWrap: "break-word",
          }}
        >
          <p>{msg.content}</p>
          <p
            className={`text-xs mt-1 ${
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
