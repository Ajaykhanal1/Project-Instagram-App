import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat, SendHorizonal } from 'lucide-react';
import { useRef, useState } from 'react';
import { dummyPosts, type Post } from "./DummyPost";
import SmartVideo from "./SmartVideo";


const Home = () => {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const users = [
        { name: "Zee Isgreat", username: "_zeeisgreat", profilePicture: "https://randomuser.me/api/portraits/women/1.jpg" },
        { name: "Suva Orth", username: "_suvha_or...", profilePicture: "https://randomuser.me/api/portraits/men/2.jpg" },
        { name: "Aditya Singh", username: "ig_adityasi...", profilePicture: "https://randomuser.me/api/portraits/men/3.jpg" },
        { name: "Shreeti Sanjay", username: "shrectisanj...", profilePicture: "https://randomuser.me/api/portraits/women/4.jpg" },
        { name: "Little Ace", username: "littlez_ace", profilePicture: "https://randomuser.me/api/portraits/men/5.jpg" },
        { name: "Revolve Fitness", username: "revolvefitn...", profilePicture: "https://randomuser.me/api/portraits/women/6.jpg" },
        { name: "Tech Guru", username: "tech_guru", profilePicture: "https://randomuser.me/api/portraits/men/7.jpg" },
        { name: "Code Master", username: "code_master", profilePicture: "https://randomuser.me/api/portraits/women/8.jpg" },
        { name: "Cyber Punk", username: "cyber_punk", profilePicture: "https://randomuser.me/api/portraits/men/9.jpg" },
        { name: "Python Dev", username: "python_dev", profilePicture: "https://randomuser.me/api/portraits/women/10.jpg" }
    ];

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
                    {users.map((user, index) => (
                        <div key={index} className="flex flex-col items-center gap-1 shrink-0">
                            {/* Story Ring */}
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-linear-to-tr from-yellow-400 to-red-500 p-0.5">
                                    <div className="w-full h-full rounded-full bg-white p-0.5">
                                        <img
                                            src={user.profilePicture}
                                            alt={user.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                                {/* Online indicator */}
                                <div className="absolute bottom-1 right-1 bg-green-500 rounded-full border-2 border-white">
                                    <div className="w-3 h-3 rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 font-medium">{user.username}</p>
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
            {dummyPosts.map((post: Post) => (
                <div key={post.id} className="mt-4">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img className="w-10 h-10 rounded-full object-cover" src={post.userImage} alt="" />
                            <div>
                                <div className="flex items-center gap-1 text-sm">
                                    <h2>{post.userName}</h2>
                                    <p>{post.timeAgo}</p>
                                </div>
                                <div className="text-xs text-gray-500">
                                    <p>{post.suggestionText}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm font-medium cursor-pointer">
                            <p className=' text-blue-500 '>{post.isFollowing ? 'Following' : 'Follow'}</p>
                            <MoreHorizontal />
                        </div>
                    </div>

                    <div className="w-90 h-100 bg-amber-50">
                        {post.postVideo ? (
                                <SmartVideo src={post.postVideo} />
                        ) : (
                            <img
                                className="w-full h-full object-cover"
                                src={post.postImage}
                                alt="post"
                            />
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-6">
                                <ActionItem icon={<Heart />} text={post.likes} />
                                <ActionItem icon={<MessageCircle />} text={post.comments} />
                                <ActionItem icon={<Repeat />} text={post.shares} />
                                <ActionItem icon={<SendHorizonal />} text="" />
                            </div>
                            <div>
                                <Bookmark />
                            </div>
                        </div>
                        <div className="mt-1 text-sm">
                            <p>{post.caption}</p>
                        </div>
                    </div>
                </div>
            ))}


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