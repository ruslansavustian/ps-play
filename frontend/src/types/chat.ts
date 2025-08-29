export interface ChatMessage {
  id: number;
  message: string;
  userName: string;
  userId?: string;
  createdAt: Date;
}

export interface JoinChatData {
  userName: string;
  userId?: string;
}

export interface SupportTicket {
  id: string;
  userName: string;
  message: string;
  status: "open" | "closed";
}
