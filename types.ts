
export interface Persona {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  systemInstruction: string;
  cardClassName: string;
  tags: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface FeedItem {
  id: string;
  persona: Persona;
  content: string; // 将保留用于向后兼容和显示摘要
  history: ChatMessage[];
  isLiked: boolean;
  isSaved: boolean;
  isLoading?: boolean;
  createdAt: Date;
}