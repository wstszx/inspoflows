import React from 'react';
import type { FeedItem } from '../../types';
import { HeartIcon } from '../icons/HeartIcon';
import { BookmarkIcon } from '../icons/BookmarkIcon';

interface CardProps {
  item: FeedItem;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ item, onLike, onSave }) => {
  const { id, persona, content, isLiked, isSaved } = item;

  return (
    <div className={`${persona.cardClassName} rounded-3xl overflow-hidden text-on-card`}>
      <div className="p-5 sm:p-6">
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
        <p className="text-base leading-relaxed whitespace-pre-wrap mb-5 min-h-[4rem]">
          {content}
        </p>
        <div className="flex items-center text-on-card/80 pt-4 border-t border-on-card/20">
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
      </div>
    </div>
  );
};

export default Card;