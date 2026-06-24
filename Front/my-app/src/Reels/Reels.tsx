import { useEffect, useState } from "react";
import ReelItem from "./ReelItem";
import { X, Heart, MessageCircle, Bookmark } from "lucide-react";
import { socket } from "../Socket/Socket";
type Post = {
    _id: string;
    mediaUrl: string;
    type: string;
    likesCount: number;
    likes: string[];
    commentCount: number;
    text: string;
    savedBy: string[];
    title: string;
    userId: {
        _id: string;
        username: string;
        avatar: string;
    };
};

type Comment = {
    _id: string;
    text: string;

    userId: {
        _id: string;
        displayName: string;
        avatar: string;
    };

    likes: string[];

    replies?: Comment[];

    createdAt: string;
};


const CommentItem = ({
    comment,
    user,
    handleCommentLike,
    setReplyTo,
    toggleReplies,
    expandedReplies,
    isReply = false
}: any) => {
    const isLiked = comment.likes.includes(user?._id);

    return (
        <div className="flex gap-3 p-2">
            <img
                src={comment.userId.avatar}
                className="w-8 h-8 rounded-full"
            />

            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">
                        {comment.userId.displayName}
                    </p>
                    <p className="font-light text-sm">{(() => {
                        const s = (Date.now() - new Date(comment.createdAt).getTime()) / 1000;
                        return s < 60 ? `${s | 0}s` :
                            s < 3600 ? `${(s / 60) | 0}m` :
                                s < 86400 ? `${(s / 3600) | 0}h` :
                                    s < 604800 ? `${(s / 86400) | 0}d` :
                                        `${(s / 2592000) | 0}mo`;
                    })()}</p>
                </div>

                <p className="text-gray-300 text-sm">{comment.text}</p>

                {/* actions */}
                <div className="flex gap-3 text-xs text-gray-400 mt-1">
                    <button
                        onClick={() => handleCommentLike(comment._id)}
                        className="flex items-center gap-1"
                    >
                        <Heart
                            size={20}
                            className={
                                isLiked
                                    ? "text-red-500 fill-red-500"
                                    : "text-white"
                            }
                        />
                        {comment.likes.length}
                    </button>

                    {!isReply && (
                        <button onClick={() => setReplyTo(comment._id)}>
                            Reply
                        </button>
                    )}
                </div>

                {/* RECURSIVE REPLIES */}
                <div className="ml-6 border-l border-gray-700 pl-3 mt-2">
                    {(() => {
                        const replies = comment.replies || [];
                        const isExpanded = expandedReplies[comment._id];

                        const visibleReplies = isExpanded
                            ? replies
                            : replies.slice(0, 1); // show only 2 initially

                        return (
                            <>
                                {visibleReplies.map((reply: any) => (
                                    <CommentItem
                                        key={reply._id}
                                        comment={reply}
                                        user={user}
                                        handleCommentLike={handleCommentLike}
                                        setReplyTo={setReplyTo}
                                        expandedReplies={expandedReplies}
                                        toggleReplies={toggleReplies}
                                        isReply={true}

                                    />
                                ))}

                                {replies.length > 1 && (
                                    <button
                                        onClick={() => toggleReplies(comment._id)}
                                        className="text-blue-400 text-xs mt-2 hover:underline"
                                    >
                                        {isExpanded
                                            ? "Hide replies"
                                            : `View ${replies.length - 1} more replies`}
                                    </button>
                                )}
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

export default function Reels() {

    const [posts, setPosts] = useState<Post[]>([]);
    const [user, setUser] = useState<any>(null);
    const [showCommentSection, setShowCommentsSection] = useState(false);
    const [comment, setComment] = useState<Comment[]>([]);

    const [newComment, setNewComment] = useState("");
    const [selectedPostId, setSelectedPostId] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setExpandedReplies({});
    }, [selectedPostId]);


    const toggleReplies = (commentId: string) => {
        setExpandedReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

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



    // REALTIME UPDATE FROM SERVER
    useEffect(() => {

        socket.on("postUpdated", (updatedPost: Post) => {

            setPosts(prev =>
                prev.map(post =>
                    post._id === updatedPost._id
                        ? {
                            ...post,
                            likes: updatedPost.likes,
                            likesCount: updatedPost.likesCount,
                            savedBy: updatedPost.savedBy,
                            commentCount: post.commentCount
                        }
                        : post
                )
            );

        });

        const handleBookmarkUpdate = ({ postId, savedBy }: any) => {
            setPosts(prev =>
                prev.map(post =>
                    post._id === postId
                        ? { ...post, savedBy }
                        : post
                )
            );
        };

        socket.on("bookmarkUpdated", handleBookmarkUpdate);

        return () => {
            socket.off("postUpdated");
            socket.off("bookmarkUpdated");
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


    useEffect(() => {
        socket.on("commentsData", (data) => {
            setComment(data);
        });

        return () => {
            socket.off("commentsData");
        };
    }, []);

    const handleComment = (postId: string) => {
        setSelectedPostId(postId);
        setShowCommentsSection(true);

        socket.emit("getComment", { postId });
    };
    // SOCKET LIKE / UNLIKE
    const handleLike = (postId: string) => {
        if (!user?._id) return;

        socket.emit("toggleLike", {
            postId,
            userId: user._id
        });
    };

    const handleCommentLike = (commentId: string) => {
        if (!user?._id) return;

        socket.emit("toggleCommentLike", {
            commentId,
            userId: user._id
        });
    };


    useEffect(() => {
        socket.on("commentUpdated", (updatedComment) => {

            setComment(prev =>
                prev.map(c =>
                    c._id === updatedComment._id
                        ? updatedComment
                        : c
                )
            );

        });

        return () => {
            socket.off("commentUpdated");
        };
    }, []);


    return (
        <div className="w-full h-screen bg-black flex justify-center">


            <div className="w-full max-w-md h-screen overflow-y-scroll scrollbar-hide snap-y snap-mandatory">
                {posts
                    .filter(p => p.type === "video")
                    .map(post => {

                        const isLiked = post.likes?.includes(user?._id);
                        const isSaved = !!post.savedBy?.includes(user?._id);
                        return (
                            <div
                                key={post._id}
                                className="h-screen snap-start flex items-center justify-center relative"
                            >
                                <div>
                                    <ReelItem 
                                        url={post.mediaUrl}
                                        username={post.userId?.username}
                                        title={post.title}
                                    />
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
                                    <div className="flex flex-col items-center gap-1 text-white">

                                        <button className="cursor-pointer" onClick={() => handleComment(post._id)}>
                                            <MessageCircle
                                                size={30}
                                                className="text-white"

                                            />
                                        </button>

                                        <span className="text-xs">{formatCount(post.commentCount)}</span>

                                    </div>

                                    {/* BookMark */}
                                    <div className="flex flex-col items-center gap-1 text-white">
                                        <Bookmark
                                            fill={isSaved ? "currentColor" : "none"}
                                            className={isSaved ? "text-yellow-500" : ""}

                                            onClick={() =>
                                                socket.emit("toggleBookmark", {
                                                    postId: post._id,
                                                    userId: user._id,
                                                })
                                            }
                                        />
                                    </div>





                                </div>



                            </div>
                        )
                    })}
            </div>














            {
                showCommentSection && (
                    <div className="fixed inset-0 z-50 flex">

                        {/* Overlay */}
                        <div
                            className="absolute inset-0 bg-black/60"
                            onClick={() => setShowCommentsSection(false)}
                        />

                        {/* Comment Panel */}
                        <div className="
      relative ml-auto
      w-full sm:w-105
      h-full
      bg-[#111]
      flex flex-col
      rounded-l-2xl
      shadow-2xl
      overflow-hidden
    ">

                            {/* Header */}
                            <div className="flex items-center justify-center relative p-4 border-b border-gray-800">
                                <X
                                    className="absolute left-4 cursor-pointer"
                                    onClick={() => setShowCommentsSection(false)}
                                />
                                <h1 className="font-semibold text-white">Comments</h1>
                            </div>

                            {/* Comments List */}
                            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-hide">

                                {comment.map((c) => (
                                    <CommentItem
                                        key={c._id}
                                        comment={c}
                                        user={user}
                                        handleCommentLike={handleCommentLike}
                                        setReplyTo={setReplyTo}
                                        expandedReplies={expandedReplies}
                                        toggleReplies={toggleReplies}
                                    />
                                ))}



                            </div>

                            {/* Input Box (Sticky Bottom like Instagram) */}
                            {replyTo && (
                                <div className="px-3 py-2 text-xs text-blue-400 border-t border-gray-800 flex justify-between items-center">
                                    <span>Replying to a comment...</span>

                                    <button
                                        onClick={() => setReplyTo(null)}
                                        className="text-red-400"
                                    >
                                        cancel
                                    </button>
                                </div>
                            )}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    if (!newComment.trim()) return;

                                    socket.emit("addComment", {
                                        postId: selectedPostId,
                                        userId: user._id,
                                        text: newComment,
                                        parentCommentId: replyTo || null,
                                    });

                                    setNewComment("");
                                    setReplyTo(null);
                                }}
                                className="border-t border-gray-800 p-3 flex items-center gap-2"
                            >

                                <input
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="
                                  flex-1
                                   bg-gray-900
                                   text-white
                                  rounded-full
                                   px-4 py-2
                                  outline-none
                                "
                                    type="text"
                                    placeholder={
                                        replyTo ? "Write a reply..." : "Add a comment..."
                                    }
                                />

                                <button
                                    type="submit"
                                    className="text-blue-500 font-semibold disabled:opacity-50"
                                    disabled={!newComment.trim()}
                                >
                                    Send
                                </button>
                            </form>

                        </div>
                    </div>
                )
            }

        </div>
    );
}