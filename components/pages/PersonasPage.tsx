import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePersonas } from '../../contexts/PersonaContext';
import type { Persona } from '../../types';
import Button from '../ui/Button';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { TagIcon } from '../icons/TagIcon';

const PersonaCard: React.FC<{ persona: Persona; onDelete: (id: string) => void }> = ({ persona, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(`确定要删除角色 "${persona.name}" 吗？`)) {
      onDelete(persona.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/personas/edit/${persona.id}`);
  };

  const handleCardClick = () => {
    navigate(`/personas/edit/${persona.id}`);
  }

  return (
    <div 
      onClick={handleCardClick}
      className={`relative rounded-3xl p-6 flex flex-col items-center text-center ${persona.cardClassName} group transition-shadow duration-200 hover:shadow-xl cursor-pointer`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
    >
      <img
        src={persona.avatarUrl}
        alt={persona.name}
        className="w-24 h-24 rounded-full mb-4 border-2 border-on-card/30"
      />
      <h3 className="text-xl font-bold text-on-card mb-2">{persona.name}</h3>
      <p className="text-on-card/80 text-sm mb-3">{persona.bio}</p>
      
      {persona.tags && persona.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {persona.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-on-card/20 text-on-card text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={handleEdit} className="p-2 bg-on-card/10 hover:bg-on-card/20 rounded-full" aria-label="编辑">
          <PencilIcon className="w-5 h-5 text-on-card" />
        </button>
        <button onClick={handleDelete} className="p-2 bg-on-card/10 hover:bg-on-card/20 rounded-full" aria-label="删除">
          <TrashIcon className="w-5 h-5 text-on-card" />
        </button>
      </div>
    </div>
  );
};

const PersonasPage: React.FC = () => {
  const { personas, deletePersona } = usePersonas();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 获取所有标签
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    personas.forEach(persona => {
      if (persona.tags) {
        persona.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [personas]);

  // 根据选中的标签筛选角色
  const filteredPersonas = useMemo(() => {
    if (!selectedTag) return personas;
    return personas.filter(persona => 
      persona.tags && persona.tags.includes(selectedTag)
    );
  }, [personas, selectedTag]);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-onBackground tracking-tight">认识启发者们</h1>
        <p className="mt-4 text-lg text-onBackground/80">
          探索、创建和管理驱动你灵感信息流的独特AI“人设”。
        </p>
      </div>
      <div className="flex justify-center mb-8">
        <Link to="/personas/new">
          <Button variant="filled">
            <PlusIcon className="w-5 h-5 mr-2" />
            创建新角色
          </Button>
        </Link>
      </div>

      {/* 标签筛选器 */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <TagIcon className="w-5 h-5 text-onBackground/70" />
            <h3 className="text-lg font-semibold text-onBackground">按标签筛选</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === null
                  ? 'bg-outline text-onOutline'
                  : 'bg-outline/20 text-onSurface hover:bg-outline/30'
              }`}
            >
              全部 ({personas.length})
            </button>
            {allTags.map(tag => {
              const count = personas.filter(p => p.tags?.includes(tag)).length;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag
                      ? 'bg-outline text-onOutline'
                      : 'bg-outline/20 text-onSurface hover:bg-outline/30'
                  }`}
                >
                  {tag} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredPersonas.map(persona => (
          <PersonaCard key={persona.id} persona={persona} onDelete={deletePersona} />
        ))}
      </div>

      {filteredPersonas.length === 0 && selectedTag && (
        <div className="text-center py-12">
          <TagIcon className="w-16 h-16 text-onBackground/40 mx-auto mb-4" />
          <p className="text-onBackground/60">没有找到标签为 "{selectedTag}" 的角色</p>
        </div>
      )}
    </div>
  );
};

export default PersonasPage;
