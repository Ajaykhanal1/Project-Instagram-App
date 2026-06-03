import { useState, useRef, useEffect } from "react";
import {
  Search,
  Edit3,
  Send,
  ChevronDown,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  Smile,
  Mic,
  Image,
  Sticker,
  Mail,
  Pin,
  BellOff,
  Trash,
  Bell,

} from "lucide-react";

type Message = {
  id: number;
  name: string;
  username?: string;
  active?: boolean;
  avatar: string;
  lastMessage: string;
  unread?: boolean;
  pinned?: boolean;
  createdAt: number;
  muted?: boolean;
  messages: {
    sender: "me" | "them";
    text: string;
  }[];
};



export default function Message() {
  // Add these state variables at the top with your other useState declarations
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Message | null>(null);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);


  const [chatUsers, setChatUsers] = useState<Message[]>([
    {
      id: 1,
      name: "Ram Babu",
      username: "__rambabu",
      active: true,
      avatar: "https://i.pravatar.cc/150?img=1",
      lastMessage: "Morning",
      createdAt: Date.now() - 1000 * 60 * 60, // 1 hour ago

      unread: true,
      messages: [
        { sender: "them", text: "Hey Ajay, good morning! ☀️" },
        { sender: "me", text: "Good morning! How's your day going?" },
        { sender: "them", text: "Pretty good so far. Just finished breakfast." },
        { sender: "me", text: "Nice! What did you have?" },
        { sender: "them", text: "Some toast, eggs, and coffee. Nothing fancy 😄" },
        { sender: "me", text: "Sounds great to me!" },
        { sender: "them", text: "By the way, how is your React project coming along?" },
        { sender: "me", text: "It's going well. I'm currently building an Instagram clone." },
        { sender: "them", text: "That's awesome! Are you working on the messaging feature now?" },
        { sender: "me", text: "Yep, exactly. I'm trying to make it look like Instagram DM." },
        { sender: "them", text: "Nice. Are you using Tailwind CSS for the styling?" },
        { sender: "me", text: "Yes, Tailwind and Lucide React icons." },
        { sender: "them", text: "Good choice. Tailwind makes UI development much faster." },
        { sender: "me", text: "I agree. The hover effects and responsive layouts are easy to build." },
        { sender: "them", text: "Have you added message bubbles and user avatars yet?" },
        { sender: "me", text: "Yes, that's already working." },
        { sender: "them", text: "Great! Next you could add typing indicators and read receipts." },
        { sender: "me", text: "That's actually on my to-do list." },
        { sender: "them", text: "Perfect. Keep going, it's turning into a solid project 🚀" },
        { sender: "me", text: "Thanks! I'll show you the final version once it's finished 😊" },
      ]
    },
    {
      id: 2,
      name: "B4K",
      username: "__B4K",
      active: false,
      avatar: "https://i.pravatar.cc/150?img=2",
      lastMessage: "Sent an attachment",
      createdAt: Date.now() - 1000 * 60 * 60 * 14, // 14 hours ago
      messages: [
        { sender: "them", text: "Check this file" },
        { sender: "me", text: "Okay, thanks." },
      ],
    },
    {
      id: 3,
      name: "Aditya Singh",
      username: "__adityasingh",
      active: true,
      avatar: "https://i.pravatar.cc/150?img=3",
      lastMessage: "Melody",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      messages: [
        { sender: "them", text: "Listen to Melody 🎵" },
        { sender: "me", text: "Nice song!" },
      ],
    },
  ]);

  const [selectedChat, setSelectedChat] = useState<Message | null>(null);



  const [message, setMessage] = useState("");
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      text: message,
      sender: "me",
    };

    // update chat messages
    setSelectedChat((prev: any) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    setMessage("");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    // Only add event listener when menu is open
    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);



  return (
    <div className="flex h-screen bg-black text-white overflow-hidden ml-20">

      {/* Sidebar */}
      <div className="w-95 border-r border-gray-800 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">ajaykhanal</h1>
            <ChevronDown size={20} />
          </div>

          <Edit3 size={22} />
        </div>

        {/* Search */}
        <div className="px-4">
          <div className="bg-zinc-900 rounded-xl flex items-center px-4 py-2">
            <Search size={20} className="text-gray-400" />
            <input
              placeholder="Search"
              className="bg-transparent outline-none ml-3 w-full text-lg"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="flex gap-5 p-4">
          <div className="flex flex-col items-center">
            <img
              src="https://i.pravatar.cc/100?img=5"
              className="w-15 h-15 rounded-full border-2 border-gray-600"
            />
            <span className="text-sm mt-2">Your note</span>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="https://i.pravatar.cc/100?img=8"
              className="w-15 h-15 rounded-full border-2 border-gray-600"
            />
            <span className="text-sm mt-2">Anu</span>
          </div>
        </div>

        {/* Messages Header */}
        <div className="flex justify-between px-5 py-2">
          <h2 className="font-bold text-xl">Messages</h2>
          <button className="text-gray-400">Requests</button>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {chatUsers.map((user) => (
            <div
              key={`${user.id}-${user.pinned}`}
              onClick={() => {
                setSelectedChat(user);

                setChatUsers((prev) =>
                  prev.map((u) =>
                    u.id === user.id ? { ...u, unread: false } : u
                  )
                );
              }}
              className={`group flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-zinc-900 transition ${selectedChat?.id === user.id
                ? "bg-zinc-900"
                : ""
                }`}
            >
              <img
                src={user.avatar}
                className="w-14 h-14 rounded-full"
              />
              {user.active && (
                <div className="w-3 h-3 rounded-full bg-green-500 fixed mt-11 ml-14" />
              )}

              <div className="flex-1">
                <h3 className="font-semibold text-lg flex items-center gap-3">
                  {user.name}
                  {user.pinned && <Pin className="w-4 h-4 text-yellow-400" />}
                  {user.muted && <BellOff className="w-4 h-4 text-gray-400" />}
                </h3>

                <p
                  className={`text-sm ${user.unread ? "text-gray-300 font-bold" : "text-gray-400"
                    }`}
                >
                  {user.lastMessage} · {user.createdAt > Date.now() - 1000 * 60 * 60 * 24
                    ? `${Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60))}h`
                    : `${Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24))}d`
                  }
                </p>
              </div>

              {user.unread && (
                <div className="w-3 h-3 rounded-full bg-blue-500" />
              )}

              {/* More Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === user.id ? null : user.id);
                }}
                className="hidden group-hover:flex items-center justify-center p-2 rounded-full hover:bg-zinc-800 cursor-pointer"
              >
                <MoreHorizontal size={20} />
              </button>

              {/* Dropdown menu */}
              {openMenuId === user.id && (

                <div
                  ref={menuRef}
                  className="fixed left-115 mt-2 w-56 bg-black text-white rounded-lg shadow-lg p-2 space-y-1 z-50"
                  onClick={(e) => e.stopPropagation()}
                >


                  {/* Mark as read / unread */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      setChatUsers((prev) =>
                        prev.map((u) =>
                          u.id === user.id
                            ? { ...u, unread: !u.unread }
                            : u
                        )
                      );
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-800">
                    <Mail className="w-5 h-5" />
                    {user.unread ? <span>Mark as read</span> : <span>Mark as unread</span>}
                  </button>



                  {/* Pin */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      setChatUsers((prev) => {
                        // First update the pinned status
                        const updated = prev.map((u) =>
                          u.id === user.id ? { ...u, pinned: !u.pinned } : u
                        );

                        // Then sort: pinned items first, then by createdAt (most recent first)
                        const sorted = [...updated].sort((a, b) => {
                          // If pinned status is different, pinned items come first
                          if (a.pinned !== b.pinned) {
                            return a.pinned ? -1 : 1;
                          }
                          // If both pinned or both not pinned, sort by createdAt (newer first)
                          return b.createdAt - a.createdAt;
                        });

                        return sorted;
                      });
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-800"
                  >
                    <Pin className="w-5 h-5" />
                    <span>{user.pinned ? "Unpin" : "Pin"}</span>
                  </button>


                  {/* Mute */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      setChatUsers((prev) =>
                        prev.map((u) =>
                          u.id === user.id ? { ...u, muted: !u.muted } : u
                        )
                      );

                      if (selectedChat?.id === user.id) {
                        setSelectedChat((prev: any) => ({
                          ...prev,
                          muted: !prev.muted
                        }));
                      }
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-800"
                  >
                    {user.muted ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                    <span>{user.muted ? "Unmute" : "Mute"}</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserToDelete(user);
                      setShowDeleteModal(true);
                      setOpenMenuId(null);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-800 text-red-500"
                  >
                    <Trash className="w-5 h-5" />
                    <span>Delete</span>
                  </button>




                </div>

              )}
            </div>
          ))}



          {/* Delete Confirmation Modal */}
          {showDeleteModal && userToDelete && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

              <div className="bg-zinc-900 rounded-2xl p-6 w-[320px] text-center shadow-xl">

                <h3 className="text-lg font-bold mb-2">
                  Delete chat?
                </h3>

                <p className="text-gray-400 text-sm mb-6">
                  This will remove the conversation with{" "}
                  <span className="text-white font-semibold">
                    {userToDelete.name}
                  </span>
                </p>

                <div className="flex gap-3">

                  {/* Cancel */}
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg"
                  >
                    Cancel
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => {
                      setChatUsers((prev) =>
                        prev.filter((u) => u.id !== userToDelete.id)
                      );

                      if (selectedChat?.id === userToDelete.id) {
                        setSelectedChat(null);
                      }

                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}




        </div>
      </div>



      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#000814] w-screen">
        {!selectedChat ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center">
              <Send size={40} />
            </div>

            <h1 className="text-3xl mt-5 font-semibold">
              Your messages
            </h1>

            <p className="text-gray-400 mt-2 text-xl">
              Send a message to start a chat.
            </p>

            <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold">
              Send message
            </button>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-800 p-4 flex items-center gap-4">
              <img
                src={selectedChat.avatar}
                className="w-12 h-12 rounded-full"
              />

              <div>
                <h2 className="font-semibold text-lg">
                  {selectedChat.name}
                </h2>
                <p className="text-gray-400 text-sm">
                  {selectedChat.username}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-10 mr-2">
                <Phone size={25} className="text-gray-400  cursor-pointer" />
                <Video size={25} className="text-gray-400  cursor-pointer" />
                <Info size={25} className="text-gray-400  cursor-pointer" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-7 custom-scrollbar ">
              {selectedChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "me"
                    ? "justify-end"
                    : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[55%] px-3 py-2 rounded-3xl wrap-break-word break-all whitespace-pre-wrap ${msg.sender === "me"
                      ? "bg-blue-600"
                      : "bg-zinc-800"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border border-gray-500 p-2 mx-7 px-5 flex items-center gap-4 bg-zinc-900 rounded-full mb-3">
              <Smile size={35} className="text-gray-400 cursor-pointer" />
              <input
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="w-full bg-zinc-900 rounded-full px-2 py-1 outline-none"
              />
              {message.trim() ? (
                <Send
                  size={30}
                  onClick={handleSendMessage}
                  className="text-white bg-blue-600 p-1 rounded-full w-15 cursor-pointer hover:text-blue-400"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <Mic size={25} className="text-gray-400 cursor-pointer" />
                  <Image size={25} className="text-gray-400 cursor-pointer" />
                  <Sticker size={25} className="text-gray-400 cursor-pointer" />
                </div>
              )}
            </div>



          </>
        )}
      </div>


    </div>
  );
}