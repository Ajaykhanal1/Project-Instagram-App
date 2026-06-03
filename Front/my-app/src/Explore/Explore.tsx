import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Play,
} from "lucide-react";

/* ---------------- Types ---------------- */
type ImageItem = {
  id: number;
  src: string;
  likes: number;
  comments: number;
  description: string;
  hasVideo: boolean;
  aspectRatio: number;
  author: string;
  authorAvatar: string;
};

/* ---------------- Hook ---------------- */
const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

/* ---------------- Component ---------------- */
const Explore: React.FC = () => {
  const width = useWindowWidth();

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const [searchQuery] = useState("");

  const images: ImageItem[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      likes: 75800,
      comments: 65,
      description: "come back as a VILLAIN",
      hasVideo: false,
      aspectRatio: 1,
      author: "villain.style",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      likes: 43200,
      comments: 128,
      description: "The hair I wanted 💇‍♀️",
      hasVideo: false,
      aspectRatio: 1,
      author: "hair.artist",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      likes: 124500,
      comments: 342,
      description: "Sunset vibes 🌅",
      hasVideo: true,
      aspectRatio: 0.8,
      author: "sunset.lover",
      authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50",
    },
    // New images start here
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
      likes: 89200,
      comments: 234,
      description: "Japanese garden aesthetics 🍁",
      hasVideo: false,
      aspectRatio: 1.2,
      author: "japan.travel",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
      likes: 156700,
      comments: 489,
      description: "Cute cat sleeping 😺",
      hasVideo: false,
      aspectRatio: 0.9,
      author: "cat.lover",
      authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=50",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400",
      likes: 34500,
      comments: 78,
      description: "Coffee art tutorial ☕",
      hasVideo: true,
      aspectRatio: 1,
      author: "barista.life",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=400",
      likes: 234100,
      comments: 567,
      description: "Mountain camping adventure ⛰️",
      hasVideo: false,
      aspectRatio: 1.3,
      author: "adventure.time",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      likes: 98700,
      comments: 201,
      description: "Street fashion Tokyo 🗼",
      hasVideo: false,
      aspectRatio: 0.85,
      author: "tokyo.style",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400",
      likes: 67300,
      comments: 145,
      description: "Photography tips 📸",
      hasVideo: true,
      aspectRatio: 1,
      author: "photo.daily",
      authorAvatar: "https://images.unsplash.com/photo-1520810625419-57e362c514ff?w=50",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      likes: 112400,
      comments: 298,
      description: "Forest waterfall wonder 🌲",
      hasVideo: false,
      aspectRatio: 0.75,
      author: "nature.captures",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
      likes: 44500,
      comments: 89,
      description: "Urban exploration 🏙️",
      hasVideo: false,
      aspectRatio: 1.1,
      author: "city.explorer",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400",
      likes: 178900,
      comments: 423,
      description: "Morning coffee routine ☀️",
      hasVideo: false,
      aspectRatio: 0.95,
      author: "morning.vibes",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 13,
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      likes: 75800,
      comments: 65,
      description: "come back as a VILLAIN",
      hasVideo: false,
      aspectRatio: 1,
      author: "villain.style",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 14,
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      likes: 43200,
      comments: 128,
      description: "The hair I wanted 💇‍♀️",
      hasVideo: false,
      aspectRatio: 1,
      author: "hair.artist",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 15,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      likes: 124500,
      comments: 342,
      description: "Sunset vibes 🌅",
      hasVideo: true,
      aspectRatio: 0.8,
      author: "sunset.lover",
      authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50",
    },
    // New images start here
    {
      id: 16,
      src: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
      likes: 89200,
      comments: 234,
      description: "Japanese garden aesthetics 🍁",
      hasVideo: false,
      aspectRatio: 1.2,
      author: "japan.travel",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 17,
      src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
      likes: 156700,
      comments: 489,
      description: "Cute cat sleeping 😺",
      hasVideo: false,
      aspectRatio: 0.9,
      author: "cat.lover",
      authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=50",
    },
    {
      id: 18,
      src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400",
      likes: 34500,
      comments: 78,
      description: "Coffee art tutorial ☕",
      hasVideo: true,
      aspectRatio: 1,
      author: "barista.life",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50",
    },
    {
      id: 19,
      src: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=400",
      likes: 234100,
      comments: 567,
      description: "Mountain camping adventure ⛰️",
      hasVideo: false,
      aspectRatio: 1.3,
      author: "adventure.time",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50",
    },
    {
      id: 20,
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      likes: 98700,
      comments: 201,
      description: "Street fashion Tokyo 🗼",
      hasVideo: false,
      aspectRatio: 0.85,
      author: "tokyo.style",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50",
    },
    {
      id: 21,
      src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400",
      likes: 67300,
      comments: 145,
      description: "Photography tips 📸",
      hasVideo: true,
      aspectRatio: 1,
      author: "photo.daily",
      authorAvatar: "https://images.unsplash.com/photo-1520810625419-57e362c514ff?w=50",
    },
    {
      id: 22,
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      likes: 112400,
      comments: 298,
      description: "Forest waterfall wonder 🌲",
      hasVideo: false,
      aspectRatio: 0.75,
      author: "nature.captures",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 23,
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
      likes: 44500,
      comments: 89,
      description: "Urban exploration 🏙️",
      hasVideo: false,
      aspectRatio: 1.1,
      author: "city.explorer",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400",
      likes: 178900,
      comments: 423,
      description: "Morning coffee routine ☀️",
      hasVideo: false,
      aspectRatio: 0.95,
      author: "morning.vibes",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      likes: 75800,
      comments: 65,
      description: "come back as a VILLAIN",
      hasVideo: false,
      aspectRatio: 1,
      author: "villain.style",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      likes: 43200,
      comments: 128,
      description: "The hair I wanted 💇‍♀️",
      hasVideo: false,
      aspectRatio: 1,
      author: "hair.artist",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      likes: 124500,
      comments: 342,
      description: "Sunset vibes 🌅",
      hasVideo: true,
      aspectRatio: 0.8,
      author: "sunset.lover",
      authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50",
    },
    // New images start here
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
      likes: 89200,
      comments: 234,
      description: "Japanese garden aesthetics 🍁",
      hasVideo: false,
      aspectRatio: 1.2,
      author: "japan.travel",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
      likes: 156700,
      comments: 489,
      description: "Cute cat sleeping 😺",
      hasVideo: false,
      aspectRatio: 0.9,
      author: "cat.lover",
      authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=50",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400",
      likes: 34500,
      comments: 78,
      description: "Coffee art tutorial ☕",
      hasVideo: true,
      aspectRatio: 1,
      author: "barista.life",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=400",
      likes: 234100,
      comments: 567,
      description: "Mountain camping adventure ⛰️",
      hasVideo: false,
      aspectRatio: 1.3,
      author: "adventure.time",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      likes: 98700,
      comments: 201,
      description: "Street fashion Tokyo 🗼",
      hasVideo: false,
      aspectRatio: 0.85,
      author: "tokyo.style",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400",
      likes: 67300,
      comments: 145,
      description: "Photography tips 📸",
      hasVideo: true,
      aspectRatio: 1,
      author: "photo.daily",
      authorAvatar: "https://images.unsplash.com/photo-1520810625419-57e362c514ff?w=50",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      likes: 112400,
      comments: 298,
      description: "Forest waterfall wonder 🌲",
      hasVideo: false,
      aspectRatio: 0.75,
      author: "nature.captures",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
      likes: 44500,
      comments: 89,
      description: "Urban exploration 🏙️",
      hasVideo: false,
      aspectRatio: 1.1,
      author: "city.explorer",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400",
      likes: 178900,
      comments: 423,
      description: "Morning coffee routine ☀️",
      hasVideo: false,
      aspectRatio: 0.95,
      author: "morning.vibes",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      likes: 75800,
      comments: 65,
      description: "come back as a VILLAIN",
      hasVideo: false,
      aspectRatio: 1,
      author: "villain.style",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      likes: 43200,
      comments: 128,
      description: "The hair I wanted 💇‍♀️",
      hasVideo: false,
      aspectRatio: 1,
      author: "hair.artist",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      likes: 124500,
      comments: 342,
      description: "Sunset vibes 🌅",
      hasVideo: true,
      aspectRatio: 0.8,
      author: "sunset.lover",
      authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50",
    },
    // New images start here
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
      likes: 89200,
      comments: 234,
      description: "Japanese garden aesthetics 🍁",
      hasVideo: false,
      aspectRatio: 1.2,
      author: "japan.travel",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
      likes: 156700,
      comments: 489,
      description: "Cute cat sleeping 😺",
      hasVideo: false,
      aspectRatio: 0.9,
      author: "cat.lover",
      authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=50",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400",
      likes: 34500,
      comments: 78,
      description: "Coffee art tutorial ☕",
      hasVideo: true,
      aspectRatio: 1,
      author: "barista.life",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=400",
      likes: 234100,
      comments: 567,
      description: "Mountain camping adventure ⛰️",
      hasVideo: false,
      aspectRatio: 1.3,
      author: "adventure.time",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      likes: 98700,
      comments: 201,
      description: "Street fashion Tokyo 🗼",
      hasVideo: false,
      aspectRatio: 0.85,
      author: "tokyo.style",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400",
      likes: 67300,
      comments: 145,
      description: "Photography tips 📸",
      hasVideo: true,
      aspectRatio: 1,
      author: "photo.daily",
      authorAvatar: "https://images.unsplash.com/photo-1520810625419-57e362c514ff?w=50",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      likes: 112400,
      comments: 298,
      description: "Forest waterfall wonder 🌲",
      hasVideo: false,
      aspectRatio: 0.75,
      author: "nature.captures",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
      likes: 44500,
      comments: 89,
      description: "Urban exploration 🏙️",
      hasVideo: false,
      aspectRatio: 1.1,
      author: "city.explorer",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400",
      likes: 178900,
      comments: 423,
      description: "Morning coffee routine ☀️",
      hasVideo: false,
      aspectRatio: 0.95,
      author: "morning.vibes",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      likes: 75800,
      comments: 65,
      description: "come back as a VILLAIN",
      hasVideo: false,
      aspectRatio: 1,
      author: "villain.style",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      likes: 43200,
      comments: 128,
      description: "The hair I wanted 💇‍♀️",
      hasVideo: false,
      aspectRatio: 1,
      author: "hair.artist",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      likes: 124500,
      comments: 342,
      description: "Sunset vibes 🌅",
      hasVideo: true,
      aspectRatio: 0.8,
      author: "sunset.lover",
      authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50",
    },
    // New images start here
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
      likes: 89200,
      comments: 234,
      description: "Japanese garden aesthetics 🍁",
      hasVideo: false,
      aspectRatio: 1.2,
      author: "japan.travel",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
      likes: 156700,
      comments: 489,
      description: "Cute cat sleeping 😺",
      hasVideo: false,
      aspectRatio: 0.9,
      author: "cat.lover",
      authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=50",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400",
      likes: 34500,
      comments: 78,
      description: "Coffee art tutorial ☕",
      hasVideo: true,
      aspectRatio: 1,
      author: "barista.life",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=400",
      likes: 234100,
      comments: 567,
      description: "Mountain camping adventure ⛰️",
      hasVideo: false,
      aspectRatio: 1.3,
      author: "adventure.time",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      likes: 98700,
      comments: 201,
      description: "Street fashion Tokyo 🗼",
      hasVideo: false,
      aspectRatio: 0.85,
      author: "tokyo.style",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400",
      likes: 67300,
      comments: 145,
      description: "Photography tips 📸",
      hasVideo: true,
      aspectRatio: 1,
      author: "photo.daily",
      authorAvatar: "https://images.unsplash.com/photo-1520810625419-57e362c514ff?w=50",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      likes: 112400,
      comments: 298,
      description: "Forest waterfall wonder 🌲",
      hasVideo: false,
      aspectRatio: 0.75,
      author: "nature.captures",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
      likes: 44500,
      comments: 89,
      description: "Urban exploration 🏙️",
      hasVideo: false,
      aspectRatio: 1.1,
      author: "city.explorer",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400",
      likes: 178900,
      comments: 423,
      description: "Morning coffee routine ☀️",
      hasVideo: false,
      aspectRatio: 0.95,
      author: "morning.vibes",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      likes: 75800,
      comments: 65,
      description: "come back as a VILLAIN",
      hasVideo: false,
      aspectRatio: 1,
      author: "villain.style",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      likes: 43200,
      comments: 128,
      description: "The hair I wanted 💇‍♀️",
      hasVideo: false,
      aspectRatio: 1,
      author: "hair.artist",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      likes: 124500,
      comments: 342,
      description: "Sunset vibes 🌅",
      hasVideo: true,
      aspectRatio: 0.8,
      author: "sunset.lover",
      authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50",
    },
    // New images start here
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
      likes: 89200,
      comments: 234,
      description: "Japanese garden aesthetics 🍁",
      hasVideo: false,
      aspectRatio: 1.2,
      author: "japan.travel",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
      likes: 156700,
      comments: 489,
      description: "Cute cat sleeping 😺",
      hasVideo: false,
      aspectRatio: 0.9,
      author: "cat.lover",
      authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=50",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400",
      likes: 34500,
      comments: 78,
      description: "Coffee art tutorial ☕",
      hasVideo: true,
      aspectRatio: 1,
      author: "barista.life",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=400",
      likes: 234100,
      comments: 567,
      description: "Mountain camping adventure ⛰️",
      hasVideo: false,
      aspectRatio: 1.3,
      author: "adventure.time",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      likes: 98700,
      comments: 201,
      description: "Street fashion Tokyo 🗼",
      hasVideo: false,
      aspectRatio: 0.85,
      author: "tokyo.style",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400",
      likes: 67300,
      comments: 145,
      description: "Photography tips 📸",
      hasVideo: true,
      aspectRatio: 1,
      author: "photo.daily",
      authorAvatar: "https://images.unsplash.com/photo-1520810625419-57e362c514ff?w=50",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      likes: 112400,
      comments: 298,
      description: "Forest waterfall wonder 🌲",
      hasVideo: false,
      aspectRatio: 0.75,
      author: "nature.captures",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
      likes: 44500,
      comments: 89,
      description: "Urban exploration 🏙️",
      hasVideo: false,
      aspectRatio: 1.1,
      author: "city.explorer",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400",
      likes: 178900,
      comments: 423,
      description: "Morning coffee routine ☀️",
      hasVideo: false,
      aspectRatio: 0.95,
      author: "morning.vibes",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      likes: 75800,
      comments: 65,
      description: "come back as a VILLAIN",
      hasVideo: false,
      aspectRatio: 1,
      author: "villain.style",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
      likes: 43200,
      comments: 128,
      description: "The hair I wanted 💇‍♀️",
      hasVideo: false,
      aspectRatio: 1,
      author: "hair.artist",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      likes: 124500,
      comments: 342,
      description: "Sunset vibes 🌅",
      hasVideo: true,
      aspectRatio: 0.8,
      author: "sunset.lover",
      authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50",
    },
    // New images start here
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
      likes: 89200,
      comments: 234,
      description: "Japanese garden aesthetics 🍁",
      hasVideo: false,
      aspectRatio: 1.2,
      author: "japan.travel",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
      likes: 156700,
      comments: 489,
      description: "Cute cat sleeping 😺",
      hasVideo: false,
      aspectRatio: 0.9,
      author: "cat.lover",
      authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=50",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400",
      likes: 34500,
      comments: 78,
      description: "Coffee art tutorial ☕",
      hasVideo: true,
      aspectRatio: 1,
      author: "barista.life",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=400",
      likes: 234100,
      comments: 567,
      description: "Mountain camping adventure ⛰️",
      hasVideo: false,
      aspectRatio: 1.3,
      author: "adventure.time",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      likes: 98700,
      comments: 201,
      description: "Street fashion Tokyo 🗼",
      hasVideo: false,
      aspectRatio: 0.85,
      author: "tokyo.style",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400",
      likes: 67300,
      comments: 145,
      description: "Photography tips 📸",
      hasVideo: true,
      aspectRatio: 1,
      author: "photo.daily",
      authorAvatar: "https://images.unsplash.com/photo-1520810625419-57e362c514ff?w=50",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      likes: 112400,
      comments: 298,
      description: "Forest waterfall wonder 🌲",
      hasVideo: false,
      aspectRatio: 0.75,
      author: "nature.captures",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
      likes: 44500,
      comments: 89,
      description: "Urban exploration 🏙️",
      hasVideo: false,
      aspectRatio: 1.1,
      author: "city.explorer",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400",
      likes: 178900,
      comments: 423,
      description: "Morning coffee routine ☀️",
      hasVideo: false,
      aspectRatio: 0.95,
      author: "morning.vibes",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    },
  ];


  /* ---------------- Helpers ---------------- */


  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const getColumnCount = () => {
    if (width < 700) return 1;
    if (width < 800) return 2;
    return 3;
  };

  const getColumns = () => {
    const cols: ImageItem[][] = Array.from(
      { length: getColumnCount() },
      () => []
    );

    filteredImages.forEach((img, i) => {
      cols[i % getColumnCount()].push(img);
    });

    return cols;
  };

  const getRandomPosts = (arr: ImageItem[], count: number) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };
  const [visibleImages, setVisibleImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    setVisibleImages(getRandomPosts(images, 50));
  }, []);

  const filteredImages = visibleImages.filter(
    (img) =>
      img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-black text-white flex overflow-y-auto custom-scrollbar px-30 mt-10">

      {/* Main */}
      <div className="flex-1 ml-20">


        {/* Grid */}
        <div className="p-2 flex ">
          {getColumns().map((col, i) => (
            <div key={i} className="flex-1 space-y-px">
              {col.map((img) => {

                return (
                  <div
                    key={img.id}
                    className="relative overflow-hidden bg-gray-900"
                    style={{ aspectRatio: img.aspectRatio }}
                    onMouseEnter={() => setHoveredId(img.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <img
                      src={img.src}
                      className="w-full h-full object-cover"
                    />

                    {img.hasVideo && (
                      <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full">
                        <Play size={12} />
                      </div>
                    )}

                    {/* Hover */}
                    <div
                      className={`absolute inset-0 bg-black/60 flex flex-col justify-between p-3 transition ${hoveredId === img.id ? "opacity-100" : "opacity-0"
                        }`}
                    >
                      <div className="flex justify-end">
                        <Bookmark
                          size={16}
                        />
                      </div>

                      {/* Hover Overlay */}
                      <div
                        className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${hoveredId === img.id ? "opacity-100" : "opacity-0"
                          }`}
                      >
                        <div className="flex items-center gap-6 text-white">

                          {/* Likes */}
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 fill-white" />
                            <span className="text-sm font-semibold">
                              {formatNumber(img.likes)}
                            </span>
                          </div>

                          {/* Comments */}
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm font-semibold">
                              {formatNumber(img.comments)}
                            </span>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;