import React, { useState } from 'react';
import type { FeedItem, ChatMessage } from '../../types';
import { useFeedContent } from '../../contexts/FeedContentContext';
import { continueConversation } from '../../services/geminiService';
import { HeartIcon } from '../icons/HeartIcon';
import { BookmarkIcon } from '../icons/BookmarkIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { UsersIcon } from '../icons/UsersIcon';

interface CardProps {
  item: FeedItem;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ item, onLike, onSave }) => {
  const { id, persona, history, isLiked, isSaved } = item;
  const { addMessageToHistory } = useFeedContent();
  const [newMessage, setNewMessage] = useState('');
  const [isContinuing, setIsContinuing] = useState(false);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isContinuing) return;

    setIsContinuing(true);
    const userMessage: ChatMessage = { role: 'user', parts: [{ text: newMessage }] };
    addMessageToHistory(id, userMessage);
    setNewMessage('');

    try {
      const response = await continueConversation(persona.systemInstruction, history, newMessage);
      const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response }] };
      addMessageToHistory(id, modelMessage);
    } catch (error) {
      console.error("Failed to continue conversation:", error);
      const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "抱歉，我暂时无法回复。" }] };
      addMessageToHistory(id, errorMessage);
    } finally {
      setIsContinuing(false);
    }
  };

  return (
    <div className={`${persona.cardClassName} rounded-3xl overflow-hidden text-on-card flex flex-col`}>
      <div className="p-5 sm:p-6 flex-grow">
        <div className="flex items-center mb-4">
          <img
            className="w-12 h-12 rounded-full mr-4 border-2 border-on-card/20"
            src={persona.avatarUrl}
            alt={`${persona.name}'s avatar`}
          />
          <div>
            <p className="font-bold text-lg">{persona.name}</p>
            <p className="text-sm opacity-80">@{persona.id}</p>
          </div>
        </div>
        <div className="space-y-4 mb-5">
          {history.map((chat, index) => (
            <div key={index} className={`flex items-start gap-3 ${chat.role === 'user' ? 'justify-end' : ''}`}>
              {chat.role === 'model' && <UsersIcon className="w-6 h-6 text-on-card/80 flex-shrink-0 mt-1" />}
              <div className={`max-w-[85%] rounded-xl px-4 py-2 whitespace-pre-wrap ${chat.role === 'model' ? 'bg-on-card/10' : 'bg-on-card/20'}`}>
                {chat.parts[0].text}
              </div>
              {chat.role === 'user' && <PencilIcon className="w-5 h-5 text-on-card/80 flex-shrink-0 mt-1" />}
            </div>
          ))}
          {isContinuing && (
             <div className="flex items-start gap-3">
                <UsersIcon className="w-6 h-6 text-on-card/80 flex-shrink-0 mt-1" />
                <div className="max-w-[85%] rounded-xl px-4 py-2 bg-on-card/10 animate-pulse">
                  思考中...
                </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-5 sm:p-6 border-t border-on-card/20">
        <div className="flex items-center text-on-card/80 mb-4">
          <button
            onClick={() => onLike(id)}
            className="flex items-center space-x-2 hover:text-on-card transition-colors duration-200 focus:outline-none"
            aria-label="喜欢"
          >
            <HeartIcon className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <div className="w-8"></div>
          <button
            onClick={() => onSave(id)}
            className="flex items-center space-x-2 hover:text-on-card transition-colors duration-200 focus:outline-none"
            aria-label="收藏"
          >
            <BookmarkIcon className="w-6 h-6" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <form onSubmit={handleContinue} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="继续追问..."
            className="w-full bg-on-card/10 text-on-card rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-on-card/50"
            disabled={isContinuing}
          />
          <button type="submit" className="bg-on-card/20 text-on-card rounded-full p-2 hover:bg-on-card/30 transition-colors duration-200 focus:outline-none" disabled={isContinuing}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Card;