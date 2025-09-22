"use client";

import { Bot, Info, User } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";

export const ChatHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Bot Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Junaid’s Voice Bot
            </h1>
            <p className="text-sm text-gray-500">Your AI Chat Assistant</p>
          </div>
        </div>

        {/* Right: User Profile and Context Button */}
        <button
          onClick={toggleModal}
          className="flex items-center gap-x-2 px-2 py-2 border border-indigo text-indigo text-sm rounded-full hover:bg-indigo-700 hover:!text-white transition-colors cursor-pointer"
        >
          <Info size={18} />
          <span className="hidden sm:inline text-sm font-medium">
            Junaid Shaikh
          </span>
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal} />
    </header>
  );
};
