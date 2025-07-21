import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { generateInspiration } from '../../services/geminiService';
import { usePersonas } from '../../contexts/PersonaContext';
import { useFeedContent } from '../../contexts/FeedContentContext';
import type { FeedItem, Persona } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import SkeletonCard from '../ui/SkeletonCard';
import { SparklesIcon } from '../icons/SparklesIcon';
import { PlusIcon } from '../icons/PlusIcon';

const FeedPage: React.FC = () => {
  const { personas } = usePersonas();
  const { addItem, updateItem, toggleLike, toggleSave } = useFeedContent();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getRandomPersona = useCallback((): Persona | undefined => {
    if (personas.length === 0) return undefined;
    return personas[Math.floor(Math.random() * personas.length)];
  }, [personas]);

  const fetchContent = useCallback(async (persona: Persona, itemId: string) => {
    try {
      const content = await generateInspiration(persona.systemInstruction);
      const updatedItem = {
        id: itemId,
        persona,
        content,
        isLiked: false,
        isSaved: false,
        isLoading: false,
        createdAt: new Date()
      };
      
      setFeedItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? updatedItem : item
        )
      );
      
      // 添加到全局内容管理
      addItem(updatedItem);
      
      if (content.startsWith("错误：")) {
        setError(content);
      } else {
        setError(null);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '发生未知错误';
      setError(errorMessage);
      const failedItem = {
        id: itemId,
        persona,
        content: `加载失败: ${errorMessage}`,
        isLiked: false,
        isSaved: false,
        isLoading: false,
        createdAt: new Date()
      };
      
      setFeedItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? failedItem : item
        )
      );
    }
  }, [addItem]);

  const generateNewItems = useCallback((count: number): FeedItem[] => {
    if (personas.length === 0) return [];
    return Array.from({ length: count }).map(() => {
        const newId = uuidv4();
        const newPersona = getRandomPersona();
        if (!newPersona) throw new Error("No persona available"); 
        return {
          id: newId,
          persona: newPersona,
          content: '',
          isLiked: false,
          isSaved: false,
          isLoading: true,
          createdAt: new Date(),
        };
      });
  }, [getRandomPersona, personas.length]);

  const generateMoreContent = useCallback(() => {
    if (personas.length === 0) return;
    const newItems = generateNewItems(5);
    setFeedItems(prev => [...newItems, ...prev]);
    newItems.forEach(item => {
      fetchContent(item.persona, item.id);
    });
  }, [fetchContent, generateNewItems, personas.length]);

  useEffect(() => {
    const initialLoad = async () => {
        if (personas.length === 0) {
            setIsLoading(false);
            setFeedItems([]);
            return;
        }
        setIsLoading(true);
        setFeedItems([]);
        const initialCards = generateNewItems(5);
        setFeedItems(initialCards);
        await Promise.all(initialCards.map(item => fetchContent(item.persona, item.id)));
        setIsLoading(false);
    };
    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personas, generateNewItems]);


  const handleLike = (id: string) => {
    setFeedItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isLiked: !item.isLiked } : item
      )
    );
    toggleLike(id);
  };

  const handleSave = (id: string) => {
    setFeedItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isSaved: !item.isSaved } : item
      )
    );
    toggleSave(id);
  };
  
  const isApiKeyMissing = !process.env.API_KEY;

  if (isApiKeyMissing) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-64">
        <h2 className="text-2xl font-bold text-error mb-2">配置错误</h2>
        <p className="text-onBackground/80">Gemini API 密钥未配置。</p>
        <p className="text-onBackground/60 mt-2 text-sm">请要求应用管理员设置 \`API_KEY\` 环境变量。</p>
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-64 space-y-4">
        <h2 className="text-2xl font-bold text-onSurface">没有可用的角色</h2>
        <p className="text-onBackground/80">信息流需要至少一个AI角色来生成内容。</p>
        <Link to="/personas">
          <Button variant="filled">
             <PlusIcon className="w-5 h-5 mr-2" />
             去创建角色
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Button onClick={generateMoreContent} disabled={isLoading || feedItems.some(item => item.isLoading)} variant="filled">
          <SparklesIcon className="w-5 h-5 mr-2" />
          {feedItems.some(item => item.isLoading) ? '生成中...' : '获取新灵感'}
        </Button>
      </div>
      
      {error && <div className="bg-errorContainer text-onErrorContainer px-4 py-3 rounded-lg text-center font-medium">{error}</div>}

      <div className="space-y-6">
        {isLoading && feedItems.length === 0 && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        {feedItems.map(item => (
            item.isLoading ? 
            <SkeletonCard key={item.id} /> :
            <Card key={item.id} item={item} onLike={handleLike} onSave={handleSave} />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;