"use client";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  type: "user" | "bot";
  content: string;
  isStreaming?: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      if (voices.length === 0) {
        setVoiceError(
          "No voices available. Please check your browser settings or try another browser."
        );
        return;
      }
      const jarvisVoice = voices.find(
        (voice) =>
          voice.name.includes("Daniel") ||
          voice.name.includes("UK English Male") ||
          voice.name.toLowerCase().includes("british")
      );
      if (jarvisVoice) {
        utteranceRef.current = new SpeechSynthesisUtterance();
        utteranceRef.current.voice = jarvisVoice;
        utteranceRef.current.rate = 1.0;
        utteranceRef.current.pitch = 1.0;
        setVoiceError(null);
      } else {
        setVoiceError(
          "No suitable Jarvis-like voice found. Using default voice."
        );
        utteranceRef.current = new SpeechSynthesisUtterance();
      }
    };

    loadVoices();
    synthRef.current.onvoiceschanged = loadVoices;

    return () => {
      synthRef.current.onvoiceschanged = null;
      synthRef.current.cancel();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { type: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    const botMessageIndex = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { type: "bot", content: "", isStreaming: true },
    ]);

    try {
      const eventSource = new EventSource(
        `http://localhost:3000/api/stream?question=${encodeURIComponent(input)}`
      );

      let fullResponse = "";

      eventSource.onmessage = (event: MessageEvent) => {
        if (event.data === "[DONE]") {
          eventSource.close();
          setIsStreaming(false);
          setMessages((prev) => {
            const updated = [...prev];
            updated[botMessageIndex].isStreaming = false;
            return updated;
          });

          if (utteranceRef.current && fullResponse) {
            utteranceRef.current.text = fullResponse;
            utteranceRef.current.onstart = () => setIsSpeaking(true);
            utteranceRef.current.onend = () => setIsSpeaking(false);
            utteranceRef.current.onerror = (err) => {
              setIsSpeaking(false);
              setVoiceError(`Speech error: ${err.error}`);
              console.error("SpeechSynthesis error:", err);
            };
            try {
              synthRef.current.speak(utteranceRef.current);
            } catch (err) {
              setVoiceError(
                "Failed to start speech. Please check browser permissions."
              );
              console.error("SpeechSynthesis speak error:", err);
            }
          } else if (!utteranceRef.current) {
            setVoiceError(
              "No speech utterance available. Voice feature disabled."
            );
          }
        } else {
          fullResponse += event.data;
          setMessages((prev) => {
            const updated = [...prev];
            updated[botMessageIndex].content = fullResponse;
            return updated;
          });
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        setIsStreaming(false);
        setMessages((prev) => {
          const updated = [...prev];
          updated[botMessageIndex].content =
            "Error occurred while streaming response.";
          updated[botMessageIndex].isStreaming = false;
          return updated;
        });
      };
    } catch (error) {
      console.error("Stream setup error:", error);
      setIsStreaming(false);
      setMessages((prev) => {
        const updated = [...prev];
        updated[botMessageIndex].content = "Error setting up stream.";
        updated[botMessageIndex].isStreaming = false;
        return updated;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center p-6">
      <header className="w-full max-w-3xl mb-8">
        <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-lg">
          Chat with Junaid's Voice Bot
        </h1>
        <p className="text-lg text-gray-200 text-center mt-3 font-medium">
          Hey there! I'm Junaid Shaikh, a 24-year-old full-stack developer from
          Pune. Ask me about my projects, passions, or personality!
        </p>
        {voiceError && (
          <p className="text-sm text-red-300 text-center mt-3 bg-red-900/50 p-2 rounded-lg">
            {voiceError}
          </p>
        )}
      </header>
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col h-[80vh] transition-all duration-300">
        <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              } transition-all duration-300`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-200 ${
                  msg.type === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
                    : "bg-gradient-to-r from-gray-700 to-gray-900 text-gray-100"
                }`}
              >
                {msg.content}
                {msg.type === "bot" && msg.isStreaming && (
                  <span className="animate-pulse text-blue-300">...</span>
                )}
                {msg.type === "bot" &&
                  !msg.isStreaming &&
                  isSpeaking &&
                  index === messages.length - 1 && (
                    <div className="flex space-x-1 mt-3 justify-center">
                      <div className="w-2 bg-blue-300 rounded-full animate-wave1 h-5"></div>
                      <div className="w-2 bg-blue-300 rounded-full animate-wave2 h-7"></div>
                      <div className="w-2 bg-blue-300 rounded-full animate-wave3 h-9"></div>
                      <div className="w-2 bg-blue-300 rounded-full animate-wave2 h-7"></div>
                      <div className="w-2 bg-blue-300 rounded-full animate-wave1 h-5"></div>
                    </div>
                  )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-gray-900/50 backdrop-blur-md flex items-center border-t border-gray-700">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-gray-800/50 text-white p-4 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            disabled={isStreaming}
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-r-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200"
            disabled={isStreaming}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
