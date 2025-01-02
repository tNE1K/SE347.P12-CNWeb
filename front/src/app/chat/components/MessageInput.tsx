import React, { useState } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  sender: string;
  recipient: string;
  chatId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, sender, recipient, chatId }) => {
  const [message, setInput] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);

      try {
        await fetch(`${process.env.MY_API_URL}/chat/messages`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            _id: "6774f42da75f4f556a2d4344",
            content: message, 
            sender, 
            recipient, 
            timestamp: new Date().toISOString(),
            status: "sent", 
            type: "text",
            attachment_url: null, 
            chatId: chatId, 
            isRead: false 
          }),
        });
      } catch (error) {
        console.error("Error posting message to MongoDB:", error);
      }

      setInput("");
    }
  };

  return (
    <form className="p-4 border-t flex items-center" onSubmit={handleSend}>
      <input
        type="text"
        value={message}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        className="flex-grow border rounded px-2 py-1"
      />
      <button type="submit" className="ml-2 px-4 py-1 border rounded bg-blue-500 text-white">
        Send
      </button>
    </form>
  );
};

export default MessageInput;
