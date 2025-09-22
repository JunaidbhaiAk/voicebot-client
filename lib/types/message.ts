export enum EntityType {
  USER = "user",
  BOT = "bot",
}
export type Message = {
  type: EntityType;
  content: string;
  isStreaming?: boolean;
};
