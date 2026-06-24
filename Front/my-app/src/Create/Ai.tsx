import { Bot } from "lucide-react";

const Ai = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 cursor-pointer!">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-lg text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
            <Bot size={40} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          AI Section
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400">
          This feature is currently unavailable.
        </p>

        <p className="text-sm text-zinc-500 mt-2">
          We're working on it and it will be available soon.
        </p>

        <button
          className="mt-6 px-5 py-2 cursor-pointer bg-gray-500 text-white rounded-lg transition"
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
};

export default Ai;