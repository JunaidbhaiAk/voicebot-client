import { ChatInputPropType } from "@/lib/types/components";
import { SendHorizontal } from "lucide-react";
import React, { useState } from "react";

export const ChatInput = ({
  onSend,
  isStreaming,
  isSpeaking,
}: ChatInputPropType) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming || isSpeaking) return;
    onSend(input);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 flex items-center border-t border-gray-200 bg-gray-50 rounded-b-2xl"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question..."
        className="flex-1 bg-white border border-gray-300 text-gray-900 px-4 py-3 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-400"
        disabled={isStreaming || isSpeaking}
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-r-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        disabled={isStreaming || isSpeaking}
      >
        <SendHorizontal />
      </button>
    </form>
  );
};
