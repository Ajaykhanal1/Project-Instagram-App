import React from "react";
import { ImagePlay, Network } from "lucide-react";
import { useState } from "react";
import Post from "./Post";
import AI from "./Ai";

type CreateProps = {
  onClose: () => void;
};

const Create: React.FC<CreateProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 "
      onClick={onClose} // click outside closes
    >
      <div
        className="absolute top-112 left-6 w-48 bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking menu
      >
        <button
          onClick={() => setActiveTab("post")}
          className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-700 cursor-pointer">
          <ImagePlay className="w-5 h-5" />
          <span>Post</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-700 cursor-pointer">
          <Network className="w-5 h-5" />
          <span>AI</span>
        </button>
      </div>













      {activeTab === "post" && (
        <Post onClose={onClose} />
      )}

      {activeTab === "ai" && (
        <AI />
      )}
    </div>
  );
}







export default Create;