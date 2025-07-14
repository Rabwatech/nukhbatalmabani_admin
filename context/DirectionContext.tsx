'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Direction = 'rtl' | 'ltr';
type Language = 'ar' | 'en';

interface DirectionContextType {
  direction: Direction;
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  const [direction, setDirection] = useState<Direction>('rtl');

  useEffect(() => {
    const newDirection = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    document.documentElement.dir = newDirection;
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    direction,
    language,
    setLanguage,
    isRTL: direction === 'rtl'
  };

  return (
    <DirectionContext.Provider value={value}>
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection() {
  const context = useContext(DirectionContext);
  if (context === undefined) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
}