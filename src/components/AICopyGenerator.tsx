"use client";

import { useState } from 'react';
import { POST_STYLES, PostStyle, analyzeCaption, CopyEnhancement } from '@/lib/ai-prompts';

interface AICopyGeneratorProps {
  onCaptionGenerated: (caption: string) => void;
  currentCaption: string;
  imageContext?: string;
}

export default function AICopyGenerator({ onCaptionGenerated, currentCaption, imageContext }: AICopyGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>('engaging');
  const [additionalContext, setAdditionalContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [enhancements, setEnhancements] = useState<CopyEnhancement[]>([]);

  const generateCaption = async () => {
    setLoading(true);
    try {
      const style = POST_STYLES.find(s => s.id === selectedStyle);
      
      const res = await fetch('/api/ai-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style: selectedStyle,
          prompt: style?.prompt,
          context: additionalContext,
          imageContext: imageContext
        })
      });

      const data = await res.json();
      if (data.caption) {
        onCaptionGenerated(data.caption);
      }
    } catch (error) {
      console.error('Erro ao gerar legenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeCurrentCaption = () => {
    const analysis = analyzeCaption(currentCaption);
    setEnhancements(analysis);
    setShowAnalysis(true);
  };

  const improveCaptionWithAI = async (enhancement: CopyEnhancement) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'improve',
          caption: currentCaption,
          enhancement: enhancement
        })
      });

      const data = await res.json();
      if (data.caption) {
        onCaptionGenerated(data.caption);
      }
    } catch (error) {
      console.error('Erro ao melhorar legenda:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Estilo */}
      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Estilo de Copy
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {POST_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedStyle === style.id
                  ? 'border-purple-400 bg-purple-500/20 scale-105'
                  : 'border-white/30 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-3xl mb-2">{style.emoji}</div>
              <div className="text-white font-medium text-sm mb-1">{style.name}</div>
              <div className="text-white/70 text-xs">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Contexto Adicional */}
      <div>
        <label className="text-white font-semibold mb-2 block flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Contexto Adicional (Opcional)
        </label>
        <textarea
          className="w-full p-3 rounded-xl bg-white/10 border-2 border-white/30 text-white placeholder-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition"
          placeholder="Ex: Produto, público-alvo, objetivo do post, tom de voz..."
          rows={2}
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
        />
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3">
        <button
          onClick={generateCaption}
          disabled={loading}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-3 border-white/30 border-t-white"></div>
              Gerando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Gerar Copy com IA
            </>
          )}
        </button>

        {currentCaption && (
          <button
            onClick={analyzeCurrentCaption}
            className="px-6 py-4 bg-white/10 border-2 border-white/30 text-white rounded-xl font-medium hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analisar
          </button>
        )}
      </div>

      {/* Análise e Sugestões */}
      {showAnalysis && enhancements.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-400/50 rounded-xl p-6">
          <h4 className="text-white font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Sugestões de Melhoria
          </h4>
          
          <div className="space-y-3">
            {enhancements.map((enhancement, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-amber-300 font-semibold text-sm">{enhancement.title}</span>
                    <p className="text-white/90 text-sm mt-1">{enhancement.suggestion}</p>
                  </div>
                  <button
                    onClick={() => improveCaptionWithAI(enhancement)}
                    disabled={loading}
                    className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition disabled:opacity-50 whitespace-nowrap"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dicas Rápidas */}
      <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Dicas para Copy de Alto Engajamento
        </h4>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• Primeiras 3 palavras são cruciais para parar o scroll</li>
          <li>• Perguntas aumentam comentários em até 300%</li>
          <li>• Use storytelling para criar conexão emocional</li>
          <li>• CTAs claros aumentam conversões em 2x</li>
        </ul>
      </div>
    </div>
  );
}
