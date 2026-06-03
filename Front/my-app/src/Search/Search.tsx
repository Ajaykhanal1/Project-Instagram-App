import { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";

type SearchComponentProps = {
  onClose: () => void;
};


export default function SearchComponent({ onClose }: SearchComponentProps) {

  const [query, setQuery] = useState("");

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

          <div>
            <p className="text-sm text-white mb-1 font-bold">Recent</p>
            <div className="h-120 w-full flex items-center justify-center">
              <p className="text-gray-500 text-sm font-bold">No recent searches</p>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}