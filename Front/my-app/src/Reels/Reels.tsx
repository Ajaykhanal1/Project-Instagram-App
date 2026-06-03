import { useEffect, useState } from "react";
import ReelItem from "./ReelItem";
import { Heart} from "lucide-react";
import { socket } from "../Socket/Socket";

type Post = {
    _id: string;
    mediaUrl: string;
    type: string;
    likesCount: number;
    likes: string[];
};


export default function Reels() {

    const [posts, setPosts] = useState<Post[]>([]);
    const [user, setUser] = useState<any>(null);

    // GET USER
    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:5000/api/user/profile/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setUser(data));
    }, []);

    // SOCKET CONNECT + GET POSTS
    useEffect(() => {
        // ask server for posts
        socket.emit("getPosts");
        // receive posts from server
        socket.on("postsData", (data: Post[]) => {
            // 🔥 RANDOM POSTS
            data = data.sort(() => Math.random() - 0.5);
            setPosts(data);
        });
        // cleanup
        return () => {
            socket.off("postsData");
        };
    }, []);

    // SOCKET LIKE / UNLIKE
    const handleLike = (postId: string) => {
        if (!user?._id) return;

        socket.emit("toggleLike", {
            postId,
            userId: user._id
        });
    };

    // REALTIME UPDATE FROM SERVER
    useEffect(() => {

        socket.on("postUpdated", (updatedPost: Post) => {

            setPosts(prev =>
                prev.map(post =>
                    post._id === updatedPost._id ? updatedPost : post
                )
            );

        });

        return () => {
            socket.off("postUpdated");
        };

    }, []);


    const formatCount = (num: number) => {
        if (!num) return "0";

        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(1).replace(".0", "") + "B";
        }

        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1).replace(".0", "") + "M";
        }

        if (num >= 1_000) {
            return (num / 1_000).toFixed(1).replace(".0", "") + "K";
        }

        return num.toString();
    };



    return (
        <div className="w-full h-screen bg-black flex justify-center">
            <div className="w-full max-w-md h-screen overflow-y-scroll scrollbar-hide snap-y snap-mandatory">





                {posts
                    .filter(p => p.type === "video")
                    .map(post => {

                        const isLiked = post.likes?.includes(user?._id);

                        return (
                            <div
                                key={post._id}
                                className="h-screen snap-start flex items-center justify-center relative"
                            >
                                <div>
                                    <ReelItem url={post.mediaUrl} />
                                </div>


                                <div className="ml-2 flex flex-col gap-5">

                                    {/* LIKE BUTTON */}
                                    <div className="flex flex-col items-center gap-1 text-white">

                                        <button className="cursor-pointer" onClick={() => handleLike(post._id)}>
                                            <Heart
                                                size={30}
                                                className={
                                                    isLiked
                                                        ? "text-red-500 fill-red-500"
                                                        : "text-white"
                                                }
                                            />
                                        </button>

                                        <span className="text-xs">
                                            {formatCount(post.likesCount)}
                                        </span>

                                    </div>

                                    {/* COMMENT */}
                                    


                                </div>

                            </div>
                        );
                    })}







            </div>

        </div>
    );
}