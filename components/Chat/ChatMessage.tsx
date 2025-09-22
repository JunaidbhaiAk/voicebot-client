"use client";

import { ChatMessagePropType } from "@/lib/types/components";
import React, { useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";

export const ChatMessages = ({ messages, isSpeaking }: ChatMessagePropType) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent">
      {messages.map((msg, index) => {
        const isUser = msg.type === "user";
        return (
          <div
            key={index}
            className={`flex items-end gap-3 ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            {/* Bot Avatar */}
            {!isUser && (
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-6 h-6" />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-md text-sm leading-relaxed ${
                isUser
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.content}
              {msg.type === "bot" && msg.isStreaming && (
                <span className="animate-pulse text-indigo-400">...</span>
              )}
              {msg.type === "bot" &&
                !msg.isStreaming &&
                isSpeaking &&
                index === messages.length - 1 && (
                  <div className="flex space-x-1 mt-3 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 bg-indigo-400 rounded-full ${
                          i % 2 ? "animate-wave2 h-7" : "animate-wave1 h-5"
                        }`}
                      />
                    ))}
                  </div>
                )}
            </div>

            {/* User Avatar */}
            {isUser && (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white shadow-md">
                <User className="w-6 h-6" />
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
