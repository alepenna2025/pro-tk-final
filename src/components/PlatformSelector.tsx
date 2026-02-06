import { useState } from 'react';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
}

type Platform = {
  id: string;
  name: string;
  icon: string;
};

const PLATFORMS: Platform[] = [
  { id: 'ig-feed', name: 'Instagram Feed', icon: '📷' },
  { id: 'ig-reels', name: 'Instagram Reels', icon: '🎬' },
  { id: 'facebook', name: 'Facebook', icon: '👥' },
  { id: 'pages', name: 'Business Pages', icon: '📄' },
];

export default function PlatformSelector({ selectedPlatforms, onPlatformsChange }: PlatformSelectorProps) {
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onPlatformsChange(selectedPlatforms.filter(p => p !== platformId));
    } else {
      onPlatformsChange([...selectedPlatforms, platformId]);
    }
  };

  return (
    <section className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
      <label className="block text-white font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Selecione as Plataformas
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedPlatforms.includes(platform.id)
                ? 'border-purple-400 bg-purple-500/20 text-white shadow-lg'
                : 'border-white/30 bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">{platform.icon}</span>
              <span className="font-medium text-sm text-center">{platform.name}</span>
            </div>
          </button>
        ))}
      </div>
      
      <p className="text-sm text-white/70 mt-3">Sua publicação será enviada para todas as plataformas selecionadas</p>
    </section>
  );
}
