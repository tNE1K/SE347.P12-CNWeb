import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "react-notifications-component/dist/theme.css";
import axios from "axios";
import { useAuth } from "@/app/component/authProvider";
import { formatDistanceToNow } from "date-fns";
import IconButton from "@mui/material/IconButton/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

interface ChatListProps {
  onSelectChat: (chatId: string, receiver: string) => void;
}

interface LastMessage {
  senderId: string;
  content: string;
  timestamp: string;
}

interface Chat {
  id: string;
  participants: {
    sender: string;
    receiver: string;
  };
  receiverName: string;
  isGroupChat: boolean;
  lastMessage: LastMessage;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newChatUsername, setNewChatUsername] = useState("");
  const { user } = useAuth();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!user?.id) return;
    console.log("Fetching chats for user:", user.id);
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.MY_API_URL}/chat/list`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }
        const result = await response.json();
        if (result.status === "success") {
          setChats(result.data.chats);
        } else {
          throw new Error("Failed to fetch chats");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch chats",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, reloadTrigger]);

  useEffect(() => {
    if (error) {
      setNotificationMessage(`Error: ${error}`);
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
        setError(null); // Clear the error after hiding the notification
        setNotificationMessage(null);
      }, 3000); // Hide the notification after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSelectChat = (chatId: string, receiverName: string) => {
    onSelectChat(chatId, receiverName);
  };

  const handleCreateChat = async () => {
    if (!newChatUsername.trim()) return;

    try {
      if (!user?.id) return;
      console.log("Creating chat with:", newChatUsername);
      const response = await axios.post(
        `${process.env.MY_API_URL}/chat/create`,
        {
          participants: newChatUsername,
          senderId: user.id,
          content: "",
          timestamp: new Date().toISOString(),
          isGroupChat: false,
          nameGroupChat: "",
        },
        {
          withCredentials: true,
        },
      );
      const result = response.data;
      console.log("Create chat result:", result);
      if (result.status === "success") {
        setReloadTrigger((prev) => !prev);
        setNewChatUsername("");
        setNotificationMessage("Chat created successfully with a new person!");
        setShowNotification(true);
        const timer = setTimeout(() => {
          setShowNotification(false);
          setNotificationMessage(null);
        }, 3000); // Hide the notification after 3 seconds

        return () => clearTimeout(timer);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create chat",
      );
    }
  };

  if (error && showNotification) {
    return (
      <div className="fixed left-1/2 top-4 -translate-x-1/2 transform rounded bg-red-500 px-4 py-2 text-white shadow-lg">
        User not found or Chat has been created
      </div>
    );
  }

  if (loading) {
    return (
      <div className="ml-60 flex h-full items-center justify-center">
        <CircularProgress size={60} thickness={5} />
      </div>
    );
  }

  return (
    <div className="w-1/5 border-r border-gray-300">
      {showNotification && (
        <div className="fixed left-0 right-0 top-0 bg-green-500 p-4 text-center text-white">
          {notificationMessage}
        </div>
      )}
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {chats.length === 0 && <p>No conversations found</p>}
            <div className="mt-4">
              <TextField
                id="standard-basic"
                label="Enter username to create new chat"
                variant="standard"
                fullWidth
                value={newChatUsername}
                onChange={(e) => setNewChatUsername(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateChat();
                  }
                }}
              />
            </div>
            <div className="mt-4">
              <Button variant="contained" fullWidth onClick={handleCreateChat}>
                Start conversation
              </Button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            <div className="p-4 text-center text-gray-500">
              <div className="mt-2">
                <TextField
                  id="standard-basic"
                  label="Enter username to create new chat"
                  variant="standard"
                  fullWidth
                  value={newChatUsername}
                  onChange={(e) => setNewChatUsername(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCreateChat();
                    }
                  }}
                />
              </div>
              <div className="mt-4">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleCreateChat}
                >
                  Start conversation
                </Button>
              </div>
            </div>
            {chats.map((chat) => (
              <li
                key={chat.id}
                onClick={() => handleSelectChat(chat.id, chat.receiverName)}
                className="cursor-pointer transition-colors hover:bg-gray-50"
              >
                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 truncate font-medium">
                      {chat.isGroupChat ? "Group Chat" : chat.receiverName}
                    </div>
                    {chat.lastMessage?.timestamp && (
                      <span className="ml-2 mt-2 whitespace-nowrap text-xs text-gray-500">
                        {formatDistanceToNow(
                          new Date(chat.lastMessage.timestamp),
                          { addSuffix: true },
                        )}
                      </span>
                    )}
                    <IconButton
                      aria-label="delete"
                      size="small"
                      className="mt- ml-2"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "red")
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this chat?",
                          )
                        ) {
                          try {
                            await axios.delete(
                              `${process.env.MY_API_URL}/chat/delete`,
                              {
                                data: { chat_id: chat.id },
                                withCredentials: true,
                              },
                            );
                            window.location.reload();
                          } catch (error) {
                            setError(
                              error instanceof Error
                                ? error.message
                                : "Failed to delete chat",
                            );
                          }
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                  {chat.lastMessage && (
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm text-gray-600">
                        {chat.lastMessage.content || "No messages yet"}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default ChatList;
