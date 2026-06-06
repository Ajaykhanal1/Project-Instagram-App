import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Grid } from "lucide-react";
import { socket } from "../Socket/Socket";

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

type Post = {
  _id: string;
  userId: string;
  mediaUrl: string;
  caption: string;
  createdAt: string;
};

type FollowUpdatedPayload = {
  targetUserId: string;
  followerId: string;
  followersCount: number;
  isFollowing: boolean;
};

export default function SearchProfile() {
  const { userId } = useParams();
  const [mainUser, setMainUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activePost, setAcitvePost] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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
      .then((data) => setMainUser(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!userId) return;

    socket.emit("getUserProfile", { userId }, (res: User) => {
      setUser({
        ...res,
        followers: res.followers || [],
        following: res.following || [],
      });
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    socket.emit("getUserPosts", userId, (res: Post[]) => {
      setPosts(res);
    });
  }, [userId]);

  useEffect(() => {
    const handleFollowUpdated = (data: FollowUpdatedPayload) => {
      if (data.targetUserId === userId) {
        setUser((prev) => {
          if (!prev) return prev;

          const safeFollowers = Array.isArray(prev.followers)
            ? prev.followers
            : [];

          const followers = data.isFollowing
            ? [...safeFollowers, data.followerId]
            : safeFollowers.filter((id) => id !== data.followerId);

          return {
            ...prev,
            followers,
            followersCount: data.followersCount,
          };
        });
      }
    };

    socket.on("followUpdated", handleFollowUpdated);

    return () => {
      socket.off("followUpdated", handleFollowUpdated);
    };
  }, [userId]);


  const handlePost = () => {
    setAcitvePost(true);
  }


  const isFollowing =
    user?.followers?.includes(mainUser?._id || "") ?? false;

  if (!user) return <div>Loading...</div>;

  return (
    <div className="w-3xl p-6 ml-70 overflow-y-auto h-screen scrollbar-hide">

      <div className="bg-black text-white  p-6 mt-5 ">

        {/* Header */}
        <div className="flex items-center space-x-4">
          {/* Profile picture */}
          <img
            src={user.avatar}
            alt="profile"
            className="w-40 h-40 rounded-full object-cover object-center border-2 border-gray-700 shadow-md"
          />

          {/* User info */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-xl text-gray-400">{user.displayName}</p>
            <p className="text-gray-500">{user.bio}</p>

            {/* Stats */}
            <div className="flex space-x-6">
              <span><strong>{posts.length}</strong> posts</span>
              <span><strong>{user.followers.length}</strong> followers</span>
              <span><strong>{user.following.length}</strong> following</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2 mt-14 w-2xl gap-10  ">
          <button
            onClick={() => {
              if (isFollowing) {
                socket.emit("unfollowUser", {
                  currentUserId: mainUser?._id,
                  targetUserId: user._id,
                });
              } else {
                socket.emit("followUser", {
                  currentUserId: mainUser?._id,
                  targetUserId: user._id,
                });
              }
            }}
            className={`flex-1 py-2 rounded-lg ${isFollowing
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-blue-700 hover:bg-blue-800"
              }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          <button className="flex-1 bg-gray-700 py-2 rounded-lg">
            Message
          </button>
        </div>
      </div>

      <div className="flex justify-evenly  border-b">

        {activePost ? (
          <button onClick={handlePost}>
            <Grid className="w-12 h-12 mt-10 border-b-5" />
          </button>
        ) : (
          <button onClick={handlePost}>
            <Grid className="w-12 h-12 mt-10 " />
          </button>
        )}


      </div>

      {activePost && (
        <>
          {posts.length > 0 ? (
            <div className="mt-6">
              {/* POSTS GRID */}
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => setSelectedPost(post)}
                    className="relative group aspect-square bg-black overflow-hidden cursor-pointer"
                  >
                    {post.mediaUrl?.endsWith(".mp4") ? (
                      <video
                        src={post.mediaUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={post.mediaUrl}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* HOVER OVERLAY */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 text-white text-sm font-semibold">
                        View Post
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="mt-10 text-center text-xs text-gray-500 space-y-2">
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="hover:underline cursor-pointer">Meta</span>
                  <span className="hover:underline cursor-pointer">About</span>
                  <span className="hover:underline cursor-pointer">Blog</span>
                  <span className="hover:underline cursor-pointer">Jobs</span>
                  <span className="hover:underline cursor-pointer">Help</span>
                  <span className="hover:underline cursor-pointer">API</span>
                  <span className="hover:underline cursor-pointer">Privacy</span>
                  <span className="hover:underline cursor-pointer">Terms</span>
                  <span className="hover:underline cursor-pointer">Locations</span>
                </div>

                <div>
                  © {new Date().getFullYear()} Instagram Clone by You 🚀
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-24 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                📸
              </div>

              <h2 className="text-xl font-semibold">Share Your First Post</h2>

              <p className="text-gray-500 text-sm mt-2 max-w-xs">
                When you share photos and videos, they will appear on your profile.
              </p>

              <button className="mt-5 bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg text-white font-medium">
                Create Post
              </button>
            </div>
          )}
        </>
      )}


      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedPost(null)}
        >
          {/* CARD */}
          <div
            className="w-full max-w-3xl bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <h2 className="text-white font-semibold">Post</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-white text-xl cursor-pointer hover:text-gray-400 transition"
              >
                ✕
              </button>
            </div>

            {/* MEDIA */}
            <div className="bg-black flex items-center justify-center max-h-[80vh]">
              {selectedPost.mediaUrl?.endsWith(".mp4") ? (
                <video
                  src={selectedPost.mediaUrl}
                  controls
                  className="w-full max-h-[80vh] object-contain"
                />
              ) : (
                <img
                  src={selectedPost.mediaUrl}
                  className="w-full max-h-[80vh] object-contain"
                />
              )}
            </div>

            {/* FOOTER */}
            <div className="px-4 py-3 text-white border-t border-gray-800">
              <p className="text-sm text-gray-300">
                Posted on {new Date(selectedPost.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}