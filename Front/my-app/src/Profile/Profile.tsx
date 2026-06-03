import React, { useEffect, useState } from "react";
import { Grid, PlusCircle, Bookmark, Contact } from "lucide-react";
import EditProfile from "./EditProfile";

type User = {

  username: string;
  displayName: string;
  avatar: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  bio: string;
  _id: string;
};

type Post = {
  _id: string;
  userId: string;
  mediaUrl: string;
  caption: string;
  createdAt: string;
};

const savedItems = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&h=400&fit=crop",
    label: "beat ♡",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop",
    label: "Java / JavaScript",
    subLabel: "All posts",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
    label: "Song",
  },
];



const Profile: React.FC = () => {

  const [user, setUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState(false);
  const [activePost, setAcitvePost] = useState(true);
  const [activeBookmark, setActiveBookmark] = useState(false);
  const [activeTag, setActiveTag] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
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
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`http://localhost:5000/api/posts/posts/${user?._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setPosts);
  }, [user]);


  if (!user) return <p>Loading...</p>;




  const handlePost = () => {
    setAcitvePost(true);
    setActiveBookmark(false);
    setActiveTag(false);
  }

  const handleBookmark = () => {
    setAcitvePost(false);
    setActiveBookmark(true);
    setActiveTag(false);
  };
  const handleTag = () => {
    setAcitvePost(false);
    setActiveBookmark(false);
    setActiveTag(true);
  }

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
              <span><strong>{user.postsCount}</strong> posts</span>
              <span><strong>{user.followersCount}</strong> followers</span>
              <span><strong>{user.followingCount}</strong> following</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2 mt-14 w-2xl gap-10  ">

          <button onClick={() => setEditUser(true)} className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-700 font-medium">
            Edit profile
          </button>














          <button className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-700 font-medium">
            View archive
          </button>
        </div>



        {editUser && user && (
          <EditProfile
            user={user}
            onClose={() => setEditUser(false)}
            onSave={async (formData) => {
              const token = localStorage.getItem("token");

              const res = await fetch(
                `http://localhost:5000/api/user/profile/${user._id}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  body: formData,
                }
              );

              const data = await res.json();

              setUser(data.user);
              setEditUser(false);
            }}
          />
        )}
        {/* Highlights */}
        <div className="flex items-center space-x-4 mt-10">
          <div className="flex flex-col items-center">
            <PlusCircle className="w-20 h-20 text-gray-700" />
            <span className="text-lg mt-1 font-mono">New</span>
          </div>
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



        {activeBookmark ? (
          <button onClick={handleBookmark}>
            <Bookmark className="w-12 h-12 mt-10 border-b-5" />
          </button>
        ) : (
          <button onClick={handleBookmark}>
            <Bookmark className="w-12 h-12 mt-10" />
          </button>
        )}
        {activeTag ? (
          <button onClick={handleTag}>
            <Contact className="w-12 h-12 mt-10 border-b-5" />

          </button>
        ) : (
          <button onClick={handleTag}>
            <Contact className="w-12 h-12 mt-10" />
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

      {activeBookmark && (
        <div className="min-h-screen bg-black text-white p-4">
          {/* Header */}
          <h2 className="text-lg font-semibold mb-4">
            Only you can see what you’ve saved
          </h2>

          {/* Grid of saved items */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {savedItems.map((item) => (
              <div key={item.id} className="relative group">
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {/* Overlay text */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition">
                  <p className="text-sm font-semibold">{item.label}</p>
                  {item.subLabel && (
                    <p className="text-xs text-gray-300">{item.subLabel}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer links */}
          <div className="mt-8 text-xs text-gray-500 flex flex-wrap gap-4">
            <span>Meta</span>
            <span>About</span>
            <span>Blog</span>
            <span>Jobs</span>
            <span>Help</span>
            <span>API</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Locations</span>
            <span>Popular</span>
            <span>Instagram Lite</span>
            <span>Meta AI</span>
            <span>Threads</span>
            <span>Contact Uploading & Non-Users</span>
            <span>Meta Verified</span>
          </div>
        </div>
      )}

      {activeTag && (
        <div className="min-h-screen bg-black text-white p-4">

          {/* Saved items grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {savedItems.map((item) => (
              <div key={item.id} className="relative group">
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {/* Overlay text */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition">
                  <p className="text-sm font-semibold">{item.label}</p>
                  {item.subLabel && (
                    <p className="text-xs text-gray-300">{item.subLabel}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer links */}
          <div className="mt-8 text-xs text-gray-500 flex flex-wrap gap-4">
            <span>Meta</span>
            <span>About</span>
            <span>Blog</span>
            <span>Jobs</span>
            <span>Help</span>
            <span>API</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Locations</span>
            <span>Popular</span>
            <span>Instagram Lite</span>
            <span>Meta AI</span>
            <span>Threads</span>
            <span>Contact Uploading & Non-Users</span>
            <span>Meta Verified</span>
          </div>
        </div>
      )}



    </div>

  );
};

export default Profile;
