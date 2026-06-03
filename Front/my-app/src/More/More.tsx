import React from "react";
import {
  Settings,
  Activity,
  Bookmark,
  SunMoon,
  AlertTriangle,
  LogOut,
  Users,
  AtSign
} from "lucide-react";

type CreateProps = {
  onClose: () => void;
};

const More: React.FC<CreateProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 "
      onClick={onClose} // click outside closes
    >
      <div
        className="absolute top-20 left-6 w-60 bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking menu
      >
        <div className="  text-white rounded-lg shadow-lg p-2 space-y-4">
          {/* Settings */}
          <button className=" cursor-pointer flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-700">
            <Settings className="w-4 h-4" />
            <span className="text-sm ml-3">Settings</span>
          </button>

          {/* Your activity */}
          <button className=" cursor-pointer flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-700">
            <Activity className="w-4 h-4" />
            <span className="text-sm ml-3">Your activity</span>
          </button>

          {/* Saved */}
          <button className=" cursor-pointer flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-700">
            <Bookmark className="w-4 h-4" />
            <span className="text-sm ml-3">Saved</span>
          </button>

          {/* Switch appearance */}
          <button className=" cursor-pointer flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-700">
            <SunMoon className="w-4 h-4" />
            <span className="text-sm ml-3">Switch appearance</span>
          </button>

          {/* Report a problem */}
          <button className=" cursor-pointer flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm ml-3">Report a problem</span>
          </button>

          {/* Threads */}
          <button className=" cursor-pointer flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-700">
            <AtSign className="w-4 h-4" />
            <span className="text-sm ml-3">Threads</span>
          </button>

          {/* Switch accounts */}
          <button className=" cursor-pointer flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-700">
            <Users className="w-4 h-4" />
            <span className="text-sm ml-3">Switch accounts</span>
          </button>

          {/* Log out */}
          <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className=" cursor-pointer flex items-center space-x-2 w-full px-3 py-2 rounded hover:bg-gray-700 text-red-500">
            <LogOut className="w-4 h-4" />
            <span className="text-sm ml-3">Log out</span>
          </button>



        </div>
      </div>
    </div>
  );
};

export default More;
