// dummyData.ts or放在你的组件文件顶部
export interface Post {
  id: number;
  userName: string;
  userImage: string;
  userHandle?: string;
  timeAgo: string;
  suggestionText: string;
  isFollowing: boolean;
  postImage: string;
  postVideo?: string;
  likes: number;
  comments: number;
  shares: number;
  caption: string;
  isLiked: boolean;
  isSaved: boolean;
}

export const dummyPosts: Post[] = [
  {
    id: 1,
    userName: "_zeeisgreat",
    userImage: "https://randomuser.me/api/portraits/women/1.jpg",
    userHandle: "@zeeisgreat",
    timeAgo: "2h",
    suggestionText: "Suggested for you",
    isFollowing: false,
    postImage: "https://picsum.photos/id/100/400/400",
    likes: 1234,
    comments: 89,
    shares: 45,
    caption: "Amazing day! ✨ #vibes",
    isLiked: false,
    isSaved: false
  },
  {
    id: 2,
    userName: "revolvefitn...",
    userImage: "https://randomuser.me/api/portraits/women/6.jpg",
    userHandle: "@revolvefitness",
    timeAgo: "4h",
    suggestionText: "Follow for fitness tips",
    isFollowing: true,
    postImage: "https://picsum.photos/id/20/400/400",
    postVideo:"/public/Download (3).mp4",
    likes: 3421,
    comments: 156,
    shares: 89,
    caption: "Morning workout complete! 💪",
    isLiked: true,
    isSaved: false
  },
  {
    id: 3,
    userName: "littlez_ace",
    userImage: "https://randomuser.me/api/portraits/men/5.jpg",
    userHandle: "@littlez_ace",
    timeAgo: "6h",
    suggestionText: "New post",
    isFollowing: false,
    postImage: "https://picsum.photos/id/26/400/400",
    likes: 892,
    comments: 34,
    shares: 12,
    caption: "Weekend adventures 🚀",
    isLiked: false,
    isSaved: true
  },
  {
    id: 4,
    userName: "_suvha_or...",
    userImage: "https://randomuser.me/api/portraits/men/2.jpg",
    userHandle: "@suvha_or",
    timeAgo: "8h",
    suggestionText: "Suggested for you",
    isFollowing: false,
    postImage: "https://picsum.photos/id/30/400/400",
    likes: 567,
    comments: 23,
    shares: 8,
    caption: "Coffee time ☕",
    isLiked: false,
    isSaved: false
  },
  {
    id: 5,
    userName: "ig_adityasi...",
    userImage: "https://randomuser.me/api/portraits/men/3.jpg",
    userHandle: "@ig_adityasi",
    timeAgo: "12h",
    suggestionText: "Follow back",
    isFollowing: false,
    postImage: "https://picsum.photos/id/15/400/400",
    likes: 2345,
    comments: 78,
    shares: 34,
    caption: "New content coming soon! 🔥",
    isLiked: true,
    isSaved: false
  },
  {
    id: 6,
    userName: "shrectisanj...",
    userImage: "https://randomuser.me/api/portraits/women/4.jpg",
    userHandle: "@shrectisanj",
    timeAgo: "1d",
    suggestionText: "New to Instagram",
    isFollowing: false,
    postImage: "https://picsum.photos/id/42/400/400",
    likes: 445,
    comments: 19,
    shares: 5,
    caption: "Hello world! 🌍",
    isLiked: false,
    isSaved: false
  },
  {
    id: 7,
    userName: "python_clcoding",
    userImage: "https://randomuser.me/api/portraits/men/8.jpg",
    userHandle: "@pythonclcoding",
    timeAgo: "2d",
    suggestionText: "Coding content",
    isFollowing: true,
    postImage: "https://picsum.photos/id/0/400/400",
    likes: 3421,
    comments: 234,
    shares: 156,
    caption: "Python tips and tricks! 🐍 #coding",
    isLiked: false,
    isSaved: false
  },
  {
    id: 8,
    userName: "tech_cyber",
    userImage: "https://randomuser.me/api/portraits/men/9.jpg",
    userHandle: "@tech_cyber",
    timeAgo: "3d",
    suggestionText: "Cyberpunk vibes",
    isFollowing: false,
    postImage: "https://picsum.photos/id/1/400/400",
    likes: 4567,
    comments: 345,
    postVideo: "/public/Download (2).mp4",
    shares: 123,
    caption: "Cyberpunk aesthetic ⚡",
    isLiked: true,
    isSaved: true
  }
];