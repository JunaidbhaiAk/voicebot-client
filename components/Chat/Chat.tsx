"use client";
import React from "react";
import { ChatInput } from "./ChatInput";
import { useVoice } from "@/lib/hooks/useVoice";
import { useChat } from "@/lib/hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessage";

const Chat: React.FC = () => {
  const { isSpeaking, speak } = useVoice();
  const { messages, isStreaming, sendMessage } = useChat({ speak });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navbar */}
      <ChatHeader />

      {/* Chat Window */}
      <div className="w-full max-w-4xl flex-1 flex py-6">
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col">
          <ChatMessages messages={messages} isSpeaking={isSpeaking} />
          <ChatInput
            onSend={sendMessage}
            isStreaming={isStreaming}
            isSpeaking={isSpeaking}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
