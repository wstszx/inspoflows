import React from 'react';
import { useFeedContent } from '../../contexts/FeedContentContext';
import Card from '../ui/Card';
import { BookmarkIcon } from '../icons/BookmarkIcon';

const SavedPage: React.FC = () => {
  const { savedItems, toggleSave, toggleLike } = useFeedContent();

  const handleLike = (id: string) => {
    toggleLike(id);
  };

  const handleSave = (id: string) => {
    toggleSave(id);
  };

  if (savedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-64 space-y-4">
        <BookmarkIcon className="w-16 h-16 text-onBackground/40" />
        <h2 className="text-2xl font-bold text-onSurface">暂无收藏内容</h2>
        <p className="text-onBackground/80">在信息流中收藏感兴趣的内容，它们会出现在这里。</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-onBackground tracking-tight">我的收藏</h1>
        <p className="mt-4 text-lg text-onBackground/80">
          共收藏了 {savedItems.length} 条内容
        </p>
      </div>
      
      <div className="space-y-6">
        {savedItems.map(item => (
          <Card key={item.id} item={item} onLike={handleLike} onSave={handleSave} />
        ))}
      </div>
    </div>
  );
};

export default SavedPage;