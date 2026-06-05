import { useState, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { socket } from "../Socket/Socket";
import { useNavigate } from "react-router-dom";

type SearchComponentProps = {
  onClose: () => void;
};

type User = {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
};

type Post = {
  _id: string;
  caption: string;
  mediaUrl: string;
  userId: {
    username: string;
    avatar: string;
  };
};

type GlobalSearchResponse = {
  users: User[];
  posts: Post[];
};


export default function SearchComponent({ onClose }: SearchComponentProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<GlobalSearchResponse>({
    users: [],
    posts: [],
  });

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
    if (!query) {
      setData({ users: [], posts: [] });
      return;
    }

    const delay = setTimeout(() => {
      socket.emit("globalSearch", { query, userId: user?._id }, (res: GlobalSearchResponse) => {
        setData(res);
      });
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50  ">

      {/* click outside to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* actual modal box */}
      <div className="relative w-110  text-white  p-6 space-y-4 z-10">
        <div className="space-y-4">

          <div className="flex items-center justify-between ">
            <h2 className="text-2xl font-semibold">Search</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-400 cursor-pointer" />
            </button>
          </div>


          <div className="flex   rounded-full items-center bg-gray-800 px-3 py-2">
            <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 h-5 bg-transparent outline-none  text-white placeholder-gray-400"
            />

            {query && (
              <button onClick={() => setQuery("")}>
                <X className="w-5 h-5 text-gray-400 cursor-pointer" />
              </button>
            )}
          </div>

          <div className="">
            {data.users.map((u) => (
              <div
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    navigate(`/searchProfile/${u._id}`);
                  }, 0);
                }}
                className="flex cursor-pointer justify-start gap-2.5 m-3 p-2  hover:bg-gray-800 " key={u._id}>
                <img className="w-15 h-15 rounded-full " src={u.avatar} width={30} />
                <div className="flex flex-col ">
                  <span className="text-sm">{u.username}</span>
                  <span className="font-mono text-xl">{u.displayName}</span>
                </div>
              </div>
            ))}
            {data.posts.map((p) => (
              <div key={p._id}>
                <img src={p.mediaUrl} width={50} />
                <div>
                  <b>{p.userId?.username}</b>
                  <p>{p.caption}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}