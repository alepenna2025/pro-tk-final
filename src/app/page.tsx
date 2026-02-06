"use client";

import { useState, useEffect } from 'react';
import MediaUploader from '@/components/MediaUploader';
import AICopyGenerator from '@/components/AICopyGenerator';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import ContentTypeSelector from '@/components/ContentTypeSelector';
import PlatformSelector from '@/components/PlatformSelector';
import AdvancedSchedule from '@/components/AdvancedSchedule';
import { getTheme, ThemeId } from '@/lib/themes';

const DEFAULT_TOKEN = process.env.NEXT_PUBLIC_FB_TOKEN || '';

function LoginScreen({ onLogin, currentTheme, onThemeChange }: { 
  onLogin: (token: string) => void;
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}) {
  const [token, setToken] = useState(DEFAULT_TOKEN);
  const theme = getTheme(currentTheme);

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.bg} p-4 transition-colors duration-500`}>
      <div className="absolute top-4 right-4">
        <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />
      </div>
      
      <div className={`${theme.card} p-8 rounded-2xl shadow-2xl max-w-md w-full border transition-colors duration-500`}>
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo</h2>
          <p className="text-white/80 text-sm">Conecte-se com sua conta do Facebook/Instagram</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Cole seu Token de Acesso aqui..."
            className={`w-full p-4 rounded-xl ${theme.input} border focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition font-mono text-sm`}
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          
          <button
            onClick={() => onLogin(token)}
            disabled={!token}
            className={`w-full py-4 ${theme.button} rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            Entrar
          </button>
          
          <p className="text-xs text-white/60 text-center mt-4">
            Precisa de um token? Acesse o <a href="https://developers.facebook.com/tools/explorer/" target="_blank" className="underline hover:text-white">Graph API Explorer</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [image, setImage] = useState<File | string>('');
  const [caption, setCaption] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [publishToFb, setPublishToFb] = useState(true);
  const [status, setStatus] = useState('');
  const [loadingPages, setLoadingPages] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('black');
  
  // Novos estados
  const [contentType, setContentType] = useState<'image' | 'video'>('image');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['ig-feed', 'facebook']);

  const theme = getTheme(currentTheme);

  useEffect(() => {
    // Carregar tema salvo ou usar Black como padrão
    const savedTheme = localStorage.getItem('app_theme') as ThemeId;
    if (savedTheme && savedTheme in { gradient: 1, black: 1, dark: 1, ocean: 1, sunset: 1, forest: 1 }) {
      setCurrentTheme(savedTheme);
    } else {
      // Define Black como tema padrão se não houver tema salvo
      setCurrentTheme('black');
      localStorage.setItem('app_theme', 'black');
    }

    if (DEFAULT_TOKEN) {
      setAccessToken(DEFAULT_TOKEN);
      fetchPages(DEFAULT_TOKEN);
      return;
    }

    const savedToken = localStorage.getItem('fb_token');
    if (savedToken) {
      setAccessToken(savedToken);
      fetchPages(savedToken);
    }
  }, []);

  const handleThemeChange = (newTheme: ThemeId) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('app_theme', newTheme);
  };

  const handleLogin = (token: string) => {
    if (!token.trim()) return;
    setAccessToken(token);
    localStorage.setItem('fb_token', token);
    fetchPages(token);
  };

  const handleLogout = () => {
    setAccessToken('');
    localStorage.removeItem('fb_token');
    setPages([]);
    setSelectedPage('');
    setImage('');
    setCaption('');
    setStatus('');
  };

  async function fetchPages(token: string) {
    setLoadingPages(true);
    try {
      setPages([]);
      const res = await fetch('/api/facebook?action=pages', {
        headers: { 'x-access-token': token }
      });
      const data = await res.json();
      if (data.pages) {
        setPages(data.pages);
        const firstValid = data.pages.find((p: any) => p.has_ig);
        if (firstValid) {
          setSelectedPage(firstValid.id);
        } else if (data.pages.length > 0) {
          setSelectedPage(data.pages[0].id);
        }
      } else if (data.error) {
        alert('Erro no token: ' + data.error);
        handleLogout();
      }
    } catch (e) {
      console.error("Failed to load pages", e);
    } finally {
      setLoadingPages(false);
    }
  }

  const generateCaption = async () => {
    if (!image) return alert(`Selecione uma ${contentType === 'image' ? 'imagem' : 'vídeo'} primeiro!`);
    setLoading(true);
    try {
      const res = await fetch('/api/facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken
        },
        body: JSON.stringify({ action: 'generate_caption', photoUrl: typeof image === 'string' ? image : 'FILE_UPLOAD', contentType })
      });
      const data = await res.json();
      if (data.caption) setCaption(data.caption);
    } catch (e) {
      alert('Erro ao gerar legenda');
    } finally {
      setLoading(false);
    }
  };

  const schedulePost = async () => {
    if (!selectedPage || !image) return alert('Preencha os campos obrigatórios!');

    // Validate IG linkage
    const currentPage = pages.find(p => p.id === selectedPage);
    if (!currentPage?.has_ig) {
      return alert(`A página "${currentPage?.name}" não está conectada ao Instagram Business. Conecte nas configurações do Facebook.`);
    }

    setLoading(true);
    const mediaType = contentType === 'image' ? 'imagem' : 'vídeo';
    setStatus(`📤 Preparando ${mediaType}...`);

    try {
      const formData = new FormData();
      formData.append('action', contentType === 'image' ? 'post_photo' : 'post_video');
      formData.append('pageId', selectedPage);
      formData.append('fbPageId', currentPage.page_id);
      if (currentPage.access_token) {
        formData.append('fbPageToken', currentPage.access_token);
      }
      formData.append('publishToFb', publishToFb.toString());
      formData.append('contentType', contentType);
      formData.append('platforms', selectedPlatforms.join(','));

      formData.append('message', caption);
      if (scheduledTime) formData.append('scheduledTime', scheduledTime);

      if (typeof image === 'string') {
        formData.append(contentType === 'image' ? 'photoData' : 'videoData', image);
      } else {
        formData.append(contentType === 'image' ? 'photoData' : 'videoData', image);
      }

      setStatus('☁️ Enviando para o servidor...');

      const res = await fetch('/api/facebook', {
        method: 'POST',
        headers: {
          'x-access-token': accessToken
        },
        body: formData,
      });

      setStatus('⏳ Processando publicação...');

      const data = await res.json();
      if (data.success) {
        const platforms = selectedPlatforms.length > 0 ? ` em ${selectedPlatforms.join(', ')}` : '';
        setStatus(`✅ Sucesso! ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} publicad${contentType === 'image' ? 'a' : 'o'}${platforms} (ID: ${data.result.id || 'OK'})`);
        setCaption('');
        setImage('');
      } else {
        setStatus(`❌ Erro: ${data.error}`);
      }
    } catch (e: any) {
      setStatus(`❌ Erro de conexão: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!accessToken) {
    return <LoginScreen onLogin={handleLogin} currentTheme={currentTheme} onThemeChange={handleThemeChange} />;
  }

  return (
    <main className={`min-h-screen ${theme.bg} py-8 px-4 transition-colors duration-500`}>
      <div className="max-w-5xl mx-auto">
        <div className={`${theme.card} rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-500`}>
          <header className={`${theme.button === 'bg-white text-black hover:bg-zinc-200' ? 'bg-zinc-900' : 'bg-gradient-to-r from-purple-600 to-pink-600'} p-6 text-white transition-colors duration-500`}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                    <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Social Media Poster
                </h1>
                <p className="text-white/80 text-sm">Publique no Instagram e Facebook com IA</p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeSwitcher currentTheme={currentTheme} onThemeChange={handleThemeChange} />
                <button 
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all border border-white/30"
                >
                  Sair
                </button>
              </div>
            </div>
          </header>

          <div className="p-8 space-y-8">
            <section className={`${theme.card} rounded-2xl p-6 border transition-colors duration-500`}>
              <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Selecione sua Conta
              </label>
              {loadingPages ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-white"></div>
                </div>
              ) : pages.length === 0 ? (
                <div className="p-4 bg-yellow-500/20 text-white border-yellow-400/50 border rounded-xl">
                  <p className="font-medium mb-2">Nenhuma conta encontrada</p>
                  <p className="text-sm text-white/80">
                    Verifique se o token tem permissões e se você selecionou as páginas ao gerá-lo.
                  </p>
                </div>
              ) : (
                <select
                  className="w-full p-4 border-2 border-white/30 rounded-xl bg-white/10 backdrop-blur-sm text-white font-medium focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition"
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                >
                  {pages.map(page => (
                    <option key={page.id} value={page.id} disabled={!page.has_ig} className="bg-gray-800">
                      {page.name}
                    </option>
                  ))}
                </select>
              )}
              {pages.length > 0 && (
                <p className="text-xs text-white/70 mt-2">
                  Apenas páginas conectadas ao Instagram Business podem publicar
                </p>
              )}
            </section>

            {/* Novo: Content Type Selector */}
            <ContentTypeSelector selectedType={contentType} onTypeChange={setContentType} />

            {/* Novo: Platform Selector */}
            <PlatformSelector selectedPlatforms={selectedPlatforms} onPlatformsChange={setSelectedPlatforms} />

            <section>
              <MediaUploader onMediaSelected={setImage} contentType={contentType} />
            </section>

            <section className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="mb-4">
                <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Gerador de Legenda com IA
                </h3>
                <p className="text-white/70 text-sm">Crie legendas criativas e persuasivas automaticamente</p>
              </div>

              <AICopyGenerator 
                onCaptionGenerated={setCaption}
                currentCaption={caption}
                imageContext={typeof image === 'string' ? image : ''}
              />
            </section>

            <section className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 space-y-4">
              <label className="block text-white font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Sua Legenda
              </label>
              <textarea
                className="w-full p-4 border-2 border-white/30 rounded-xl h-40 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 transition resize-none"
                placeholder="Sua legenda gerada aparecerá aqui... ou escreva manualmente!"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>{caption.length} caracteres</span>
                <span>{(caption.match(/#\w+/g) || []).length} hashtags</span>
              </div>
            </section>

            {/* Novo: Advanced Schedule */}
            <AdvancedSchedule selectedTime={scheduledTime} onTimeChange={setScheduledTime} contentType={contentType} />

            <section className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
                <input
                  type="checkbox"
                  id="fbCheck"
                  checked={publishToFb}
                  onChange={(e) => setPublishToFb(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="fbCheck" className="font-medium text-white cursor-pointer flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Publicar também no Facebook
                </label>
              </div>
            </section>

            <section className="pt-4">
              <button
                onClick={schedulePost}
                disabled={loading || !selectedPage || !image || selectedPlatforms.length === 0}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white/30 border-t-white"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {scheduledTime ? 'Agendar Publicação' : 'Publicar Agora'}
                  </>
                )}
              </button>

              {status && (
                <div className={`mt-6 p-5 rounded-xl text-center font-medium border-2 ${
                  status.includes('Sucesso') 
                    ? 'bg-green-500/20 text-white border-green-400/50' 
                    : 'bg-red-500/20 text-white border-red-400/50'
                }`}>
                  {status}
                </div>
              )}
            </section>
          </div>
        </div>

        <footer className="text-center mt-8 text-white/70 text-sm">
          <p>Powered by Facebook Graph API • Made with ❤️</p>
        </footer>
      </div>
    </main>
  );
}
