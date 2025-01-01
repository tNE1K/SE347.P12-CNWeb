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
        await fetch("http://127.0.0.1:5000/chat/messages", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            _id: "6774f42da75f4f556a2d4344", // Thay thế bằng ObjectId nếu dùng server-side
            content: message, 
            sender, // Thay bằng ID của người gửi
            recipient, // Thay bằng ID của người nhận
            timestamp: new Date().toISOString(), // Tạo timestamp hiện tại
            status: "sent", // Trạng thái tin nhắn
            type: "text", // Loại tin nhắn
            attachment_url: null, // URL đính kèm nếu có
            chatId: "6772b302761a160e587cefcb", // ID của cuộc trò chuyện
            isRead: false // Trạng thái đã đọc
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
