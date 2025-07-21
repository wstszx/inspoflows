import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { FeedItem } from '../types';

const LOCAL_STORAGE_KEY = 'feedContent';

interface FeedContentContextType {
  allItems: FeedItem[];
  savedItems: FeedItem[];
  addItem: (item: FeedItem) => void;
  updateItem: (id: string, updates: Partial<FeedItem>) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  searchItems: (query: string) => FeedItem[];
}

const FeedContentContext = createContext<FeedContentContextType | undefined>(undefined);

export const FeedContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allItems, setAllItems] = useState<FeedItem[]>(() => {
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt || new Date())
        }));
      }
    } catch (error) {
      console.error('Error reading feed content from localStorage', error);
    }
    return [];
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allItems));
    } catch (error) {
      console.error('Error saving feed content to localStorage', error);
    }
  }, [allItems]);

  const addItem = useCallback((item: FeedItem) => {
    const itemWithDate = {
      ...item,
      createdAt: item.createdAt || new Date()
    };
    setAllItems(prev => [itemWithDate, ...prev]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<FeedItem>) => {
    setAllItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const toggleLike = useCallback((id: string) => {
    updateItem(id, { isLiked: !allItems.find(item => item.id === id)?.isLiked });
  }, [allItems, updateItem]);

  const toggleSave = useCallback((id: string) => {
    updateItem(id, { isSaved: !allItems.find(item => item.id === id)?.isSaved });
  }, [allItems, updateItem]);

  const searchItems = useCallback((query: string): FeedItem[] => {
    if (!query.trim()) return allItems;
    const lowercaseQuery = query.toLowerCase();
    return allItems.filter(item => 
      item.content.toLowerCase().includes(lowercaseQuery) ||
      item.persona.name.toLowerCase().includes(lowercaseQuery) ||
      item.persona.bio.toLowerCase().includes(lowercaseQuery)
    );
  }, [allItems]);

  const savedItems = allItems.filter(item => item.isSaved);

  const value = {
    allItems,
    savedItems,
    addItem,
    updateItem,
    toggleLike,
    toggleSave,
    searchItems
  };

  return (
    <FeedContentContext.Provider value={value}>
      {children}
    </FeedContentContext.Provider>
  );
};

export const useFeedContent = (): FeedContentContextType => {
  const context = useContext(FeedContentContext);
  if (context === undefined) {
    throw new Error('useFeedContent must be used within a FeedContentProvider');
  }
  return context;
};