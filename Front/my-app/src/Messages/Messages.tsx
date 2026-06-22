import { useState, useEffect, useRef, useCallback } from "react";
import { socket } from "../Socket/Socket";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input"

type User = {
  _id: string;
  username: string;
  online: boolean;
  displayName: string;
  avatar: string;
};

type Message = {
  _id?: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
  read?: boolean;
};

type Conversation = {
  conversationId: string;
  _id: string;
  userId: string;
  avatar: string;
  username: string;
  displayName: string;
  lastMessage: string;
  updatedAt: string;
};

export default function Message() {
  const [user, setUser] = useState<User | null>(null);
  const [receiver, setReceiver] = useState<User | null>(null);
  const { userId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(userId ?? null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Search User Conversation Section
  const [query, setQuery] = useState("");

  const [suggestions, setSuggestions] = useState<User[]>([]);
  useEffect(() => {
    socket.on("search-result", (data) => {
      setSuggestions(data);
    });

    return () => { socket.off("search-result"); }
  }, []);




  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join user room when user loads
  useEffect(() => {
    if (!user?._id) return;
    socket.emit("join_user_room", user._id);
  }, [user?._id]);

  // Get logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/user/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  // Get receiver
  useEffect(() => {
    if (!userId || !user?._id) return;

    socket.emit("getUserProfile", { userId }, (res: User) => {
      setReceiver(res);
    });
  }, [userId, user?._id]);

  // Join private chat room
  useEffect(() => {
    if (!activeChat || !user?._id) return;
    socket.emit("join_private_chat", {
      userA: user._id,
      userB: activeChat,
    });
  }, [user?._id, activeChat]);

  // Send Message with optimistic update
  const sendMessage = async () => {
    try {
      // 1. Validate socket connection
      if (!socket || !socket.connected) {
        console.error("Socket is not connected");
        return;
      }

      // 2. Validate user
      if (!user?._id) {
        console.error("User not found or not logged in");
        return;
      }

      // 3. Validate active chat
      if (!activeChat) {
        console.error("No active chat selected");
        return;
      }

      // 4. Validate message
      const trimmedMessage = message.trim();
      if (!trimmedMessage) {
        console.error("Message cannot be empty");
        return;
      }

      // 5. Emit join room (safe to call multiple times, but ideally move this elsewhere)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.emit("join_user_room", user._id, (response: any) => {
        if (response?.error) {
          console.error("Failed to join room:", response.error);
        }
      });

      // 6. Send message with acknowledgement (recommended)
      socket.emit(
        "send_message",
        {
          sender: user._id,
          receiver: activeChat,
          message: trimmedMessage,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ack: any) => {
          if (ack?.error) {
            console.error("Message failed to send:", ack.error);
            return;
          }

          console.log("Message sent successfully:", ack);
        }
      );

      // 7. Clear input only after emit
      setMessage("");

    } catch (error) {
      console.error("Unexpected error while sending message:", error);
    }
  };

  // Receive message - FIXED: Prevent duplicates
  useEffect(() => {
    const handleMessage = (msg: Message) => {
      setMessages((prev) => {
        // Check if message already exists
        const exists = prev.some(
          (m) =>
            m._id === msg._id ||
            (m.sender === msg.sender &&
              m.receiver === msg.receiver &&
              m.message === msg.message &&
              Math.abs(new Date(m.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 1000)
        );

        if (exists) return prev;

        // Remove temp message if it exists
        const filtered = prev.filter((m) => !m._id?.toString().startsWith("temp-"));

        return [...filtered, msg];
      });
    };

    socket.on("new_message", handleMessage);

    return () => {
      socket.off("new_message", handleMessage);
    };
  }, []);

  // Mark as Read
  useEffect(() => {
    if (!activeChat || !user?._id) return;

    const timeout = setTimeout(() => {
      socket.emit("mark_read", {
        sender: user._id,
        receiver: activeChat,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [user?._id, activeChat]);

  // Fetch Messages - FIXED: Properly fetch messages between two users
  useEffect(() => {
    if (!activeChat || !user?._id) return;

    let isMounted = true;

    async function fetchMessages() {
      try {
        // Fetch messages where user is either sender or receiver
        const res = await fetch(
          `http://localhost:5000/api/messages/messages?sender=${user?._id}&receiver=${activeChat}`
        );

        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();

        if (isMounted && Array.isArray(data)) {
          // Sort messages by timestamp
          const sortedMessages = data.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setMessages(sortedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [user?._id, activeChat]);

  // Fetch Conversations with deduplication
  useEffect(() => {
    if (!user?._id) return;

    async function fetchConversations() {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/conversations/${user?._id}`);
        if (!res.ok) throw new Error("Failed to fetch conversations");

        const data = await res.json();

        if (Array.isArray(data)) {
          // Deduplicate conversations by userId
          const uniqueConversations = data.reduce((acc: Conversation[], current: Conversation) => {
            if (current.userId && !acc.some(item => item.userId === current.userId)) {
              acc.push(current);
            }
            return acc;
          }, []);

          setConversations(uniqueConversations);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }

    fetchConversations();
  }, [user?._id]);

  // Handle conversation update from socket
  useEffect(() => {
    const handler = (data: Conversation) => {
      if (!data || !data.userId || !data.conversationId) return;
      if (data.userId === user?._id) return;

      setConversations((prev) => {
        const existingIndex = prev.findIndex(c => c.userId === data.userId);

        let updated;
        if (existingIndex !== -1) {
          updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...data };
        } else {
          updated = [data, ...prev];
        }

        return updated.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    };

    socket.on("conversation_update", handler);

    return () => {
      socket.off("conversation_update", handler);
    };
  }, [user?._id]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSelectChat = useCallback((chat: any) => {
  if (!user?._id) return;

  const receiverId = chat.userId || chat._id;

  setActiveChat(receiverId);
  setMessages([]);

  setReceiver({
    _id: receiverId,
    username: chat.username,
    displayName: chat.displayName,
    avatar: chat.avatar,
    online: false,
  });

  socket.emit("open_chat", {
    userA: user._id,
    userB: receiverId,
  });
}, [user]);


  // Search User Conversation Section 
  const handleChange = (value: string) => {
    setQuery(value);
    socket.emit("search-user", value);
  };
  const showSuggestions = query.trim().length > 0;

  return (
    <div className="flex h-screen bg-gray-100 text-black mx-auto">
      {/* Sidebar */}
      <div className="w-80 h-screen bg-black text-white! border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="flex justify-between  items-center gap-2">
              <Input
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Search User" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">


          {showSuggestions
            ? suggestions.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-4 hover:bg-gray-800 cursor-pointer"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                  setReceiver(user);
                  handleSelectChat({
                    conversationId: "",
                    _id: "",
                    userId: user._id,
                    avatar: user.avatar,
                    username: user.username,
                    displayName: user.displayName,
                    lastMessage: "",
                    updatedAt: new Date().toISOString(),
                  });


                }}
              >
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {user.displayName?.[0]}
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-semibold">{user.displayName}</p>
                  <p className="text-sm text-gray-400">@{user.username}</p>
                </div>
              </div>
            ))
            : conversations.map((chat) => (
              <div
                key={chat.conversationId}
                onClick={() => handleSelectChat(chat)}
                className="flex items-center gap-3 p-4 hover:bg-gray-800 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold overflow-hidden">
                  {chat?.avatar ? (
                    <img className="rounded-full w-12 h-12 object-cover" src={chat.avatar} alt="Avatar" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-400 flex items-center justify-center text-white">
                      {(chat.displayName || chat.username)?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold ">
                    {chat.displayName || chat.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            ))}


        </div>
      </div>

      {/* Chat Area */}
      {activeChat ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gray-700 border-b p-4 flex items-center gap-3">
            <div className="rounded-full bg-gray-300 overflow-hidden">
              {receiver?.avatar ? (
                <img className="rounded-full w-12 h-12 object-cover" src={receiver.avatar} alt="Avatar" />
              ) : (
                <div className="w-12 h-12 bg-gray-400 flex items-center justify-center text-white">
                  {(receiver?.displayName || receiver?.username)?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold">
                {receiver?.displayName || receiver?.username}
              </h3>
              <p className="text-xs text-gray-500">
                {receiver?.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-500 scrollbar-none">
            {messages.map((msg, index) => {
              // FIXED: Compare sender with user._id to determine if message is mine
              const isMine = msg.sender === user?._id;

              return (
                <div
                  key={msg._id || index}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${isMine
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-900"
                      }`}
                  >
                    <p className="wrap-break-word">{msg.message}</p>
                    <p
                      className={`text-[10px] mt-1 ${isMine ? "text-blue-100" : "text-gray-400"
                        }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-gray-400 border-t p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />

              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <p className="text-lg">Select a conversation</p>
            <p className="text-sm">Choose a friend to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}