import { useState } from 'react';

interface ContentTypeSelectorProps {
  selectedType: 'image' | 'video';
  onTypeChange: (type: 'image' | 'video') => void;
}

export default function ContentTypeSelector({ selectedType, onTypeChange }: ContentTypeSelectorProps) {
  return (
    <section className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
      <label className="block text-white font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Tipo de Conteúdo
      </label>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onTypeChange('image')}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedType === 'image'
              ? 'border-purple-400 bg-purple-500/20 text-white shadow-lg'
              : 'border-white/30 bg-white/10 text-white/70 hover:bg-white/15'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Imagem</span>
          </div>
        </button>

        <button
          onClick={() => onTypeChange('video')}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedType === 'video'
              ? 'border-purple-400 bg-purple-500/20 text-white shadow-lg'
              : 'border-white/30 bg-white/10 text-white/70 hover:bg-white/15'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Vídeo</span>
          </div>
        </button>
      </div>
    </section>
  );
}
