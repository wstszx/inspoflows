import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePersonas } from '../../contexts/PersonaContext';
import { Persona } from '../../types';
import { CARD_COLORS } from '../../constants';
import Button from '../ui/Button';
import { SparklesIcon } from '../icons/SparklesIcon';
import { polishText } from '../../services/geminiService';

const PersonaEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPersonaById, addPersona, updatePersona } = usePersonas();
  const isEditing = Boolean(id);

  const [persona, setPersona] = useState<Omit<Persona, 'id'>>({
    name: '',
    avatarUrl: 'https://picsum.photos/seed/new-persona/128/128',
    bio: '',
    systemInstruction: '',
    cardClassName: CARD_COLORS[0],
  });
  const [isPolishingBio, setIsPolishingBio] = useState(false);
  const [isPolishingSystemInstruction, setIsPolishingSystemInstruction] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const existingPersona = getPersonaById(id);
      if (existingPersona) {
        setPersona(existingPersona);
      } else {
        navigate('/personas');
      }
    }
  }, [id, isEditing, getPersonaById, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersona(prev => ({ ...prev, [name]: value }));
  };
  
  const handleColorChange = (color: string) => {
    setPersona(prev => ({ ...prev, cardClassName: color }));
  };

  const handlePolish = async (
    fieldType: 'bio' | 'systemInstruction',
    setLoading: (loading: boolean) => void
  ) => {
    const text = persona[fieldType];
    if (!text.trim()) return;

    setLoading(true);
    try {
      const polishedText = await polishText(text, fieldType);
      if (polishedText.startsWith('错误：')) {
          alert(polishedText);
      } else {
          setPersona(prev => ({ ...prev, [fieldType]: polishedText }));
      }
    } catch (error) {
      console.error(`Failed to polish ${fieldType}:`, error);
      alert(`润色时发生错误，请稍后重试。`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && id) {
      updatePersona({ ...persona, id });
    } else {
      addPersona(persona);
    }
    navigate('/personas');
  };

  const formLabelClass = "text-sm font-medium text-onBackground/90";
  const formInputClass = "block w-full px-3 py-2 bg-surface border border-outline rounded-md shadow-sm placeholder-onSurface/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-outline";
  const polishButtonClass = "ml-auto flex items-center px-2 py-1 text-xs font-semibold text-onSurface rounded-full bg-onSurface/10 hover:bg-onSurface/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isEditing ? '编辑角色' : '创建新角色'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-onBackground/90">名称</label>
          <input type="text" id="name" name="name" value={persona.name} onChange={handleChange} required className={formInputClass} />
        </div>
        <div>
          <label htmlFor="avatarUrl" className="block mb-1 text-sm font-medium text-onBackground/90">头像链接</label>
          <input type="url" id="avatarUrl" name="avatarUrl" value={persona.avatarUrl} onChange={handleChange} placeholder="https://..." required className={formInputClass} />
        </div>
        
        <div>
          <div className="flex items-center mb-1">
            <label htmlFor="bio" className={formLabelClass}>简介</label>
            <button type="button" onClick={() => handlePolish('bio', setIsPolishingBio)} disabled={!persona.bio.trim() || isPolishingBio} className={polishButtonClass}>
              {isPolishingBio ? ( '处理中...' ) : ( <> <SparklesIcon className="w-4 h-4 mr-1" /> AI 润色 </> )}
            </button>
          </div>
          <textarea id="bio" name="bio" value={persona.bio} onChange={handleChange} rows={3} required className={formInputClass}></textarea>
          <p className="text-xs text-onBackground/60 mt-1">一句话描述这个AI角色的特点。</p>
        </div>

        <div>
          <div className="flex items-center mb-1">
            <label htmlFor="systemInstruction" className={formLabelClass}>系统指令</label>
            <button type="button" onClick={() => handlePolish('systemInstruction', setIsPolishingSystemInstruction)} disabled={!persona.systemInstruction.trim() || isPolishingSystemInstruction} className={polishButtonClass}>
              {isPolishingSystemInstruction ? ( '处理中...' ) : ( <> <SparklesIcon className="w-4 h-4 mr-1" /> AI 优化 </> )}
            </button>
          </div>
          <textarea id="systemInstruction" name="systemInstruction" value={persona.systemInstruction} onChange={handleChange} rows={6} required className={formInputClass}></textarea>
          <p className="text-xs text-onBackground/60 mt-1">这是给AI的核心指令，告诉它应该如何扮演这个角色并生成内容。</p>
        </div>

        <div>
            <label className="block text-sm font-medium text-onBackground/90 mb-1">卡片颜色</label>
            <div className="flex space-x-3">
                {CARD_COLORS.map(color => (
                    <button
                        type="button"
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`w-10 h-10 rounded-full ${color} transition-transform transform hover:scale-110 ${persona.cardClassName === color ? 'ring-2 ring-offset-2 ring-offset-background ring-onBackground' : ''}`}
                        aria-label={`选择颜色 ${color}`}
                    />
                ))}
            </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-outline/20">
          <Button type="button" variant="outline" onClick={() => navigate('/personas')}>取消</Button>
          <Button type="submit" variant="filled">{isEditing ? '保存更改' : '创建角色'}</Button>
        </div>
      </form>
    </div>
  );
};

export default PersonaEditPage;