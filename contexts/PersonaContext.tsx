import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Persona } from '../types';
import { INITIAL_PERSONAS } from '../constants';

const LOCAL_STORAGE_KEY = 'personas';

interface PersonaContextType {
  personas: Persona[];
  addPersona: (persona: Omit<Persona, 'id'>) => void;
  updatePersona: (persona: Persona) => void;
  deletePersona: (id: string) => void;
  getPersonaById: (id: string) => Persona | undefined;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [personas, setPersonas] = useState<Persona[]>(() => {
    try {
      const storedPersonas = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPersonas) {
        // A simple migration to add IDs if they don't exist
        const parsed = JSON.parse(storedPersonas);
        return parsed.map((p: Partial<Persona>) => ({...p, id: p.id || uuidv4()}));
      }
    } catch (error) {
      console.error('Error reading personas from localStorage', error);
    }
    return INITIAL_PERSONAS;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(personas));
    } catch (error) {
      console.error('Error saving personas to localStorage', error);
    }
  }, [personas]);

  const addPersona = useCallback((personaData: Omit<Persona, 'id'>) => {
    const newPersona: Persona = { ...personaData, id: uuidv4() };
    setPersonas(prev => [...prev, newPersona]);
  }, []);

  const updatePersona = useCallback((updatedPersona: Persona) => {
    setPersonas(prev => prev.map(p => p.id === updatedPersona.id ? updatedPersona : p));
  }, []);

  const deletePersona = useCallback((id: string) => {
    setPersonas(prev => prev.filter(p => p.id !== id));
  }, []);

  const getPersonaById = (id: string): Persona | undefined => {
    return personas.find(p => p.id === id);
  };

  const value = { personas, addPersona, updatePersona, deletePersona, getPersonaById };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersonas = (): PersonaContextType => {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersonas must be used within a PersonaProvider');
  }
  return context;
};
