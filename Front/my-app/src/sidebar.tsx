import {
    Heart,
    Home,
    SendHorizonal as MessageCircle,
    Plus,
    Search,
    User,
    Compass,
    MoreHorizontal,
    SquarePlay
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import SearchComponent from "./Search/Search";
import { useState, useEffect } from "react";
import Notification from "./Notifications/Notifications";
import Create from "./Create/Create";
import More from "./More/More";

type User = {
    username: string;
    displayName: string;
    avatar: string;
};


const sidebar = () => {

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const [isMore, setIsMore] = useState(false);

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


    return (
        <div className="absolute z-20 text-xl h-full w-20 hover:w-64 transition-all duration-300 border-r border-gray-800 bg-black flex-col justify-between p-4 group">


            {/* LOGO */}
            <div className="mb-6 ml-1.5 flex items-center justify-start group-hover:justify-start transition-all">
                <Link to="/dashboard">
                    <FaInstagram size={40} />
                </Link>
            </div>

            {/* MENU */}
            <div className="space-y-2">
                <Link to="/dashboard">
                    <SidebarItem icon={<Home />} text="Home" />
                </Link>

                <Link to="/reels">
                    <SidebarItem icon={<SquarePlay />} text="Reels" />
                </Link>
                <Link to="/messages">
                    <SidebarItem icon={<MessageCircle className="rotate-340" />} text="Messages" />
                </Link>


                <span onClick={() => setIsSearchOpen(true)}  >
                    <SidebarItem icon={<Search />} text="Search" />
                </span>

                {isSearchOpen && (
                    <div className="fixed w-110 bg-gray-900 inset-0 z-50">
                        <SearchComponent onClose={() => setIsSearchOpen(false)} />
                    </div>
                )}






                <Link to="/explore">
                    <SidebarItem icon={<Compass />} text="Explore" />
                </Link>





                <span onClick={() => setIsNotificationOpen(true)} >
                    <SidebarItem icon={<Heart />} text="Notifications" />
                </span>

                {isNotificationOpen && (
                    <div className="fixed w-110 bg-gray-900 inset-0 z-50">
                        <Notification onClose={() => setIsNotificationOpen(false)} />
                    </div>
                )}





                <span onClick={() => setIsCreateOpen(!isCreateOpen)}>
                    <SidebarItem icon={<Plus />} text="Create" />
                </span>

                {isCreateOpen && (
                    <Create onClose={() => setIsCreateOpen(false)} />
                )}


                <Link to="/profile">
                    <SidebarItem
                        avatar={user?.avatar}
                        icon={<User />}
                        text={user?.displayName || "Profile"}
                    />
                </Link>


                <div className="mt-20">
                    <span onClick={() => setIsMore(!isMore)}>
                        <SidebarItem icon={<MoreHorizontal />} text="More" />
                    </span>

                    {isMore && (
                        <More onClose={() => setIsMore(false)} />
                    )}
                </div>

            </div>

        </div>
    )
}

export default sidebar


function SidebarItem({
    icon,
    text,
    avatar,
}: {
    icon?: React.ReactNode;
    text: string;
    avatar?: string;
}) {
    return (
        <div className="flex items-center cursor-pointer hover:bg-gray-900 p-3 rounded-lg transition-all gap-4">

            {/* Avatar if exists, otherwise icon */}
            <div className="flex justify-center shrink-0">
                {avatar ? (
                    <img
                        src={avatar}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover border border-gray-700"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    icon
                )}
            </div>

            <span
                className="
          opacity-0 max-w-0 overflow-hidden whitespace-nowrap
          group-hover:opacity-100 group-hover:max-w-37.5
          transition-all duration-300
        "
            >
                {text}
            </span>
        </div>
    );
}