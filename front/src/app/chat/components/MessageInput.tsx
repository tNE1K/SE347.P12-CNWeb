import React, { useState } from "react";
import { Socket } from "socket.io-client";

interface MessageInputProps {
  onSendMessage: (content: string, recipient: string) => void;
  sender: string;
  recipient: string;
  chatId: string;
  socket: Socket | null;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage ,sender, recipient, chatId, socket }) => {
  const [content, setInput] = useState("");
  const [status, setStatus] = useState<string | null>(null); // Trạng thái gửi tin nhắn

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      const payload = {
        room: chatId,
        sender_id: sender,
        recipient_id: recipient,
        content: content,
        timestamp: new Date().toISOString(),
      };

      console.log("Payload to be sent:", payload);

      socket?.emit("send_message", payload, (response: { status: string; content: string }) => {
        if (response?.status === "success") {
          console.log("Message sent successfully via socket!");
        } else {
          console.error("Failed to send message via socket:", response?.content);
          setStatus("Failed to send message.");
        }
      });

      if (socket?.connected) {
        console.log("Socket is connected");
      } else {
        console.log("Socket is not connected");
        setStatus("Socket connection lost.");
      }

      if (onSendMessage) {
        onSendMessage(content, recipient);
      }

      setInput("");
    }
  };

  return (
    <form className="p-4 border-t flex items-center" onSubmit={handleSend}>
      <textarea
        value={content}
        onChange={(e) => {
          setInput(e.target.value);
          e.target.style.height = "auto"; // Reset chiều cao trước
          e.target.style.height = `${e.target.scrollHeight}px`; // Đặt chiều cao theo nội dung
        }}
        placeholder="Type a message"
        className="flex-grow border rounded px-2 py-1 resize-none"
        rows={1} // Chiều cao mặc định
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Ngăn hành động xuống dòng với Enter (không nhấn Shift)
            handleSend(e);
          }
        }}
        ref={(ref) => {
          if (ref && content === "") {
            ref.style.height = "auto"; // Reset chiều cao nếu content trống
          }
        }}
      />
      <button
        type="submit"
        className="ml-2 px-4 py-1 border rounded bg-blue-500 text-white"
      >
        Send
      </button>
      {status && <p className="text-sm text-gray-500 ml-2">{status}</p>}
    </form>

  );
};

export default MessageInput;
