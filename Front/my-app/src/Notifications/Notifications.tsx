import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { socket } from "../Socket/Socket";

type NotificationProps = {
  onClose: () => void;
};

type Notification = {
  type: "follow" | "like" | "comment";
  message: string;
  fromUserId: string;
  fromUsername: string;
  fromAvatar: string;
  createdAt: string;
};

type User = {

  username: string;
  displayName: string;
  avatar: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  bio: string;
  _id: string;
  followers: string[];
  following: string[];
};


export default function Notification({ onClose }: NotificationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/user/profile/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit(
      "getNotifications",
      { userId: user._id },
      (res: Notification[]) => {
        setNotifications(res);
      }
    );
  }, [user?._id]);

  return (
    <div className="fixed inset-0 z-50  ">

      {/* click outside to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* actual modal box */}
      <div className="relative w-110  text-white  p-6 space-y-4 z-10 ">
        <div className="space-y-4 ">

          <div className="flex items-center justify-between ">
            <h2 className="text-2xl font-semibold">Notifications</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-400 cursor-pointer" />
            </button>
          </div>

          <div className="h-150 overflow-y-scroll custom-scrollbar">
          {notifications.map((n, i) => (
            <div key={i} className="bg-gray-800 p-3 rounded mb-2 ">
              <div className="flex items-center gap-2">
                <img
                  src={n.fromAvatar}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-gray-400">
                    {n.fromUsername}
                  </p>
                </div>
              </div>
            </div>
          ))}

        </div>
        </div>
      </div>

    </div>
  );
}