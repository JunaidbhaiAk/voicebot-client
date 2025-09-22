import { useState, useRef } from "react";
import { EntityType, Message } from "../types/message";
import { createEventSource } from "../utils/eventSource";
import { UseChatProps } from "../types/hooks";
import { STREAMING_API } from "../constant";

export const useChat = ({ speak }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const fullResponseRef = useRef("");

  const sendMessage = (input: string) => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { type: EntityType.USER, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    const botMessageIndex = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { type: EntityType.BOT, content: "", isStreaming: true },
    ]);

    fullResponseRef.current = "";

    const eventSource = createEventSource(
      `${
        process.env.NEXT_PUBLIC_SERVER_URL
      }${STREAMING_API}?question=${encodeURIComponent(input)}`,
      (data) => {
        if (data === "[DONE]") {
          eventSource.close();
          setIsStreaming(false);
          setMessages((prev) => {
            const updated = [...prev];
            updated[botMessageIndex].isStreaming = false;
            return updated;
          });
          speak(fullResponseRef.current);
        } else {
          fullResponseRef.current += data;
          setMessages((prev) => {
            const updated = [...prev];
            updated[botMessageIndex].content = fullResponseRef.current;
            return updated;
          });
        }
      },
      (error) => {
        console.error("Stream error:", error);
        setIsStreaming(false);
      }
    );
  };

  return { messages, isStreaming, sendMessage };
};
