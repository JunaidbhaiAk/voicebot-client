"use client";

import { useEffect, useRef, useState } from "react";

export const useVoice = () => {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize only in the browser
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;

    // 🚫 Prevent starting new speech while already speaking
    if (synthRef.current.speaking) {
      console.warn("Already speaking, ignoring new request");
      return;
    }

    utteranceRef.current = new SpeechSynthesisUtterance(text);

    utteranceRef.current.onstart = () => setIsSpeaking(true);
    utteranceRef.current.onend = () => setIsSpeaking(false);

    synthRef.current.speak(utteranceRef.current);
  };

  const stop = () => {
    if (synthRef.current?.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return { speak, stop, isSpeaking };
};
