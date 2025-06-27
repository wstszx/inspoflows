import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePersonas } from '../../contexts/PersonaContext';
import type { Persona } from '../../types';
import Button from '../ui/Button';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';

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
      <p className="text-on-card/80 text-sm">{persona.bio}</p>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {personas.map(persona => (
          <PersonaCard key={persona.id} persona={persona} onDelete={deletePersona} />
        ))}
      </div>
    </div>
  );
};

export default PersonasPage;
