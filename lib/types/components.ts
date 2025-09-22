import { Message } from "./message";

export type ChatMessagePropType = {
  messages: Message[];
  isSpeaking: boolean;
};

export type ChatInputPropType = {
  onSend: (text: string) => void;
  isStreaming: boolean;
  isSpeaking: boolean;
};
