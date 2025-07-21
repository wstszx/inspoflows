
export interface Persona {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  systemInstruction: string;
  cardClassName: string;
  tags: string[];
}

export interface FeedItem {
  id: string;
  persona: Persona;
  content: string;
  isLiked: boolean;
  isSaved: boolean;
  isLoading?: boolean;
  createdAt: Date;
}