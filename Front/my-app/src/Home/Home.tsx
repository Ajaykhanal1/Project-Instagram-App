import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat, SendHorizonal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SmartVideo from "./SmartVideo";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "../Socket/Socket";



type User = {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
    bio: string;
    followers: string[];
    following: string[];
};

type Post = {
    _id: string;
    userId: {
        _id: string;
        username: string;
        displayName: string;
        avatar: string;
    };
    mediaUrl: string;
    type: "image" | "video";

    likes: string[];      // ← ADD THIS
    likesCount: number;

    comments: string;
    savedBy: string[];
    createdAt: string;
    shares: string;
};

type Connections = {
    followers: User[];
    following: User[];
};


const Home = () => {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const [connections, setConnections] = useState<Connections>({
        followers: [],
        following: [],
    });
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);


    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

            scrollRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 20);
            setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
        }
    };

    // ================= GET LOGGED IN USER =================
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    "http://localhost:5000/api/user/profile/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error("Unauthorized");

                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, []);
    // ================= GET FOLLOWERS + FOLLOWING =================
    useEffect(() => {
        if (!user?._id) return;

        const fetchConnections = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/user/connections/${user._id}`
                );

                setConnections(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchConnections();
    }, [user?._id]);

    // ================= MIX LIST =================
    const mixedUsers = Array.from(
        new Map(
            [
                ...connections.followers.map((u) => ({
                    ...u,
                    type: "Follower",
                })),
                ...connections.following.map((u) => ({
                    ...u,
                    type: "Following",
                })),
            ].map((item) => [item._id, item]) // 👈 unique by _id
        ).values()
    );

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/posts/feed");
                setPosts(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    // Like

    useEffect(() => {
        socket.on("postUpdated", (updatedPost) => {
            setPosts(prev =>
                prev.map(post =>
                    post._id === updatedPost._id
                        ? {
                            ...post,
                            likes: updatedPost.likes,
                            likesCount: updatedPost.likesCount,
                            savedBy: updatedPost.savedBy,
                        }
                        : post
                )
            );
        });

        return () => {
            socket.off("postUpdated");
        };
    }, []);


    const handleLike = (postId: string) => {
        try {
            if (!user?._id) {
                console.warn("User not logged in");
                return;
            }

            if (!postId) {
                console.warn("Invalid postId");
                return;
            }

            if (!socket || !socket.connected) {
                console.error("Socket not connected");
                return;
            }
            toggleLikeUI(postId); // 👈 instant UI update


            socket.emit(
                "toggleLike",
                {
                    postId,
                    userId: user._id,
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (response: any) => {
                    // This is ACK from server (if implemented)
                    if (response?.error) {
                        console.error("Like action failed:", response.error);
                        return;
                    }

                    console.log("Like updated successfully:", response);
                }
            );
        } catch (error) {
            console.error("Unexpected error in handleLike:", error);
        }
    };


    const toggleLikeUI = (postId: string) => {
        setPosts(prev =>
            prev.map(p => {
                if (p._id !== postId) return p;

                const liked = p.likes.includes(user!._id);

                return {
                    ...p,
                    likes: liked
                        ? p.likes.filter(id => id !== user!._id)
                        : [...p.likes, user!._id],

                    likesCount: liked
                        ? p.likesCount - 1
                        : p.likesCount + 1,
                };
            })
        );
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-white bg-black">
                Loading feed...
            </div>
        );
    }

    const timeAgo = (date: string) => {
        const now = new Date();
        const postDate = new Date(date);

        const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000);

        const minutes = Math.floor(diff / 60);
        const hours = Math.floor(diff / 3600);
        const days = Math.floor(diff / 86400);
        const years = Math.floor(days / 365);

        if (diff < 60) return `${diff}s`;
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 365) return `${days}d`;
        return `${years}y`;
    };

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
        <div className="overflow-x-auto custom-scrollbar flex flex-col w-full h-full items-center bg-black text-white">
            {/* Stories Container with Arrows */}
            <div className="relative w-full max-w-2xl bg-black text-white rounded-lg shadow-sm mt-4">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-all duration-200 border border-gray-200 w-8 h-8 flex items-center justify-center"
                        aria-label="Scroll left"
                    >
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {/* Scrollable Users */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto scrollbar-hide p-4 gap-7"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {mixedUsers.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => navigate(`/searchProfile/${user._id}`)}
                            className="flex flex-col items-center gap-1 shrink-0">
                            {/* Story Ring */}
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-linear-to-tr from-yellow-400 to-red-500 p-0.5">
                                    <div className="w-full h-full rounded-full bg-white p-0.5">
                                        <img
                                            src={user.avatar}
                                            alt={user.displayName}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                                {/* Online indicator */}
                                <div className="absolute bottom-1 right-1 bg-green-500 rounded-full border-2 border-white">
                                    <div className="w-3 h-3 rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 font-medium">{user.displayName}</p>
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-all duration-200 border border-gray-200 w-8 h-8 flex items-center justify-center"
                        aria-label="Scroll right"
                    >
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
            </div>



            {/* Posts */}
            {posts.map((post: Post) => {
                    const isLiked = post.likes?.includes(user?._id || "");
                return (
                    <div key={post._id} className="mt-4">

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img className="w-10 h-10 rounded-full object-cover" src={post.userId?.avatar} alt="" />
                                <div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <h2>{post.userId?.username}</h2>
                                        <p>{timeAgo(post.createdAt)}</p>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <p>Suggestion text</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm font-medium cursor-pointer">
                                <p className=' text-blue-500 '>Follow</p>
                                <MoreHorizontal />
                            </div>
                        </div>

                        <div className="w-90 h-100 bg-amber-50">
                            {post.type === "video" ? (
                                <SmartVideo src={post.mediaUrl} />
                            ) : (
                                <img
                                    className="w-full h-full object-cover"
                                    src={post.mediaUrl}
                                    alt="post"
                                />
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-6">


                                    <button className="cursor-pointer" onClick={() => handleLike(post._id)}>

                                        <ActionItem
                                            icon={
                                                <Heart
                                                    className={
                                                        isLiked
                                                            ? "text-red-500 fill-red-500"
                                                            : "text-white"
                                                    }
                                                />
                                            }
                                            text={formatCount(post.likesCount)}
                                        />
                                    </button>

                                    <ActionItem icon={<MessageCircle />} text={post.comments} />
                                    <ActionItem icon={<Repeat />} text={post.shares} />
                                    <ActionItem icon={<SendHorizonal />} text="" />
                                </div>
                                <div>
                                    <Bookmark />
                                </div>
                            </div>
                            <div className="mt-1 text-sm">
                                <p>Caption needed!</p>
                            </div>
                        </div>
                    </div>
                )
            })}


        </div>
    );
};

export default Home;


/* ACTION ITEM */
function ActionItem({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string | number;
}) {
    return (
        <div className="flex items-center text-sm gap-1">
            {icon}
            {text && <span className="text-xs">{text}</span>}
        </div>
    );
}