
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system' | 'pink';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark' | 'orange' | 'pink';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark' | 'orange' | 'pink'>('orange');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'orange', 'pink');
    
    let resolvedTheme: 'light' | 'dark' | 'orange' | 'pink';
    
    if (theme === 'system') {
      // 시스템 테마일 때는 주황색으로 설정
      resolvedTheme = 'orange';
    } else if (theme === 'pink') {
      resolvedTheme = 'pink';
    } else {
      resolvedTheme = theme as 'light' | 'dark';
    }
    
    // Add the resolved theme class
    root.classList.add(resolvedTheme);
    setActualTheme(resolvedTheme);
    
    // Store theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
