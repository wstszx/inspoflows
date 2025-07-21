import React, { useState, useEffect } from 'react';
import { useFeedContent } from '../../contexts/FeedContentContext';
import { FeedItem } from '../../types';
import Card from '../ui/Card';
import { SearchIcon } from '../icons/SearchIcon';

const SearchPage: React.FC = () => {
  const { searchItems, toggleLike, toggleSave } = useFeedContent();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FeedItem[]>([]);

  useEffect(() => {
    const searchResults = searchItems(query);
    setResults(searchResults);
  }, [query, searchItems]);

  const handleLike = (id: string) => {
    toggleLike(id);
  };

  const handleSave = (id: string) => {
    toggleSave(id);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-onBackground tracking-tight">搜索内容</h1>
        <p className="mt-4 text-lg text-onBackground/80">
          搜索您的所有内容和角色
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-onBackground/50" />
          <input
            type="text"
            placeholder="搜索内容、角色名称或简介..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-outline rounded-lg shadow-sm placeholder-onSurface/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-outline"
          />
        </div>
      </div>

      <div className="mb-4 text-sm text-onBackground/70">
        {query.trim() ? `找到 ${results.length} 条结果` : `共有 ${results.length} 条内容`}
      </div>

      <div className="space-y-6">
        {results.length === 0 && query.trim() ? (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-onBackground/40 mx-auto mb-4" />
            <p className="text-onBackground/60">没有找到匹配的内容</p>
          </div>
        ) : (
          results.map(item => (
            <Card key={item.id} item={item} onLike={handleLike} onSave={handleSave} />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;