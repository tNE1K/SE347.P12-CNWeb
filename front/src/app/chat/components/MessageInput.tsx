import { Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
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
    <form className="p-4 border-t flex items-center justify-between"
      onSubmit={handleSend}
      style={{
        height: "60px",
        alignItems: "center",
      }}
>
  <textarea
    value={content}
    onChange={(e) => {
      setInput(e.target.value);

      const element = e.target;
      element.style.height = "auto"; 
      element.style.height = `${element.scrollHeight}px`; 
    }}
    placeholder="Type a message"
    className="flex-grow border rounded px-2 py-1 resize-none"
    rows={1}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); 
        handleSend(e);
      }
    }}
    ref={(ref) => {
      if (ref && content === "") {
        ref.style.height = "auto"; 
      }
    }}
    style={{
      overflow: "hidden", 
      maxHeight: "70px", 
      flexGrow: 1, 
    }}
  />
  <Button
    type="submit"
    style={{
      marginLeft: "8px",
      height: "fit-content",
    }}
    variant="contained"
    endIcon={<SendIcon />}
  >
    Send
  </Button>
</form>

  );
};

export default MessageInput;
