import ChatContent from "./ChatContent";

export default class ChatMessage {
  role?: string;
  content?: Array<ChatContent> | string;
}