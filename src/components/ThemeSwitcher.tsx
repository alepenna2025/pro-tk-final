"use client";

import { useState } from 'react';
import { themes, ThemeId } from '@/lib/themes';

interface ThemeSwitcherProps {
  currentTheme: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
}

export default function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const themeList = Object.values(themes);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-all"
        title="Trocar tema"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-zinc-700">
              <h3 className="text-white font-semibold text-sm">Escolha o Tema</h3>
            </div>
            
            <div className="p-2 max-h-80 overflow-y-auto">
              {themeList.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id as ThemeId);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 rounded-lg mb-2 transition-all flex items-center gap-3 ${
                    currentTheme === theme.id
                      ? 'bg-white/20 ring-2 ring-white/50'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg ${theme.bg} flex-shrink-0`} />
                  <div className="text-left">
                    <div className="text-white font-medium text-sm">{theme.name}</div>
                    {currentTheme === theme.id && (
                      <div className="text-green-400 text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Ativo
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-zinc-700 bg-zinc-900/50">
              <p className="text-zinc-400 text-xs text-center">
                O tema será salvo automaticamente
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
