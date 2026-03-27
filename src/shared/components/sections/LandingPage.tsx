'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Layout, Globe, Code, PenTool, MoreHorizontal, Search, Sparkles } from 'lucide-react';

import ArchitectureSection from './ArchitectureSection';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/shared/lib/i18n';


// Refined Word-Based GitHub-style grid component
const TypingContributionGrid = ({ query }: { query: string }) => {
  const [wordData, setWordData] = useState<{ length: number; time: number }[]>([]);
  const [currentWordStart, setCurrentWordStart] = useState<number | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  
  const blocks = Array.from({ length: 100 });
  const words = query.split(/\s+/).filter(w => w.length > 0);
  const currentWord = query.endsWith(' ') ? '' : (words[words.length - 1] || '');

  useEffect(() => {
    if (query.length > 0 && !currentWordStart) {
      setCurrentWordStart(Date.now());
    }

    if (query.endsWith(' ') && lastQuery && !lastQuery.endsWith(' ')) {
      const timeSpent = currentWordStart ? Date.now() - currentWordStart : 500;
      const lastWord = lastQuery.trim().split(/\s+/).pop() || '';
      
      setWordData(prev => [
        ...prev, 
        { length: lastWord.length, time: timeSpent }
      ]);
      setCurrentWordStart(null);
    }

    if (query.length === 0) {
      setWordData([]);
      setCurrentWordStart(null);
    }

    setLastQuery(query);
  }, [query, lastQuery, currentWordStart]);

  const getWeight = (wordLen: number, timeMs: number) => {
    const timeWeight = Math.min(timeMs / 4000, 0.4);
    const lenWeight = Math.min(wordLen / 15, 0.6);
    return timeWeight + lenWeight;
  };

  const getColor = (index: number) => {
    let weight = 0;

    if (index < wordData.length) {
      weight = getWeight(wordData[index].length, wordData[index].time);
    } else if (index === wordData.length && currentWord.length > 0) {
      const timeInProgress = currentWordStart ? Date.now() - currentWordStart : 0;
      weight = getWeight(currentWord.length, timeInProgress);
    } else {
      return '#f8f8f8';
    }

    if (weight > 0.85) return '#254C92';
    if (weight > 0.55) return '#397EEF';
    if (weight > 0.25) return '#7BA9F5';
    if (weight > 0.05) return '#B8D0F9';
    return '#f4f4f5';
  };

  return (
    <div className="flex flex-col gap-1 mt-4 mb-2">
      <div className="flex flex-wrap gap-1 justify-center max-w-[500px] mx-auto">
        {blocks.map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ 
              backgroundColor: getColor(i),
              scale: (i === wordData.length && currentWord.length > 0) ? [1, 1.1, 1] : 1,
              opacity: (i <= wordData.length) ? 1 : 0.4
            }}
            transition={{ duration: 0.2 }}
            className={`w-2.5 h-2.5 rounded-[2px] ${(i === wordData.length && currentWord.length > 0) ? 'animate-pulse' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function LandingPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [isError, setIsError] = useState(false);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    setIsError(false);
    
    try {
      const res = await fetch('https://keneshub.ziz.kz/api/ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setResponse(data.reply);
        setIsError(false);
      } else {
        setResponse('Произошла ошибка при анализе. Пожалуйста, попробуйте еще раз позже.');
        setIsError(true);
      }
    } catch (error) {
      setResponse('Не удалось подключиться к сервису анализа.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      {/* Hero Content */}
      <section className="pt-[220px] pb-20 px-6">
        <div className="max-w-[1000px] mx-auto text-center">
          
          {/* Main Serif Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-[42px] sm:text-[56px] md:text-[72px] text-[#222] mb-12 tracking-tight leading-[1.05]"
          >
            {t('Чем я могу помочь вам сегодня?')}
          </motion.h1>

          {/* Search Box / Input Container */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-[700px] w-full mx-auto mb-10 relative z-20"
          >
            <div className="keneshub-pill p-1.5 sm:p-2 pl-4 sm:pl-6 flex items-center gap-2 sm:gap-4 overflow-hidden border border-[#397EEF]/20">
                <Search size={22} className="text-[#397EEF] shrink-0 hidden sm:block" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder={t('Опишите вашу ситуацию...')}
                  className="flex-1 w-full min-w-0 bg-transparent border-none outline-none text-[15px] sm:text-[18px] text-black placeholder:text-zinc-300 py-3"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleAnalyze}
                  disabled={isLoading || !query.trim()}
                  className="rounded-[14px] px-5 sm:px-8 py-3.5 sm:py-4 justify-center disabled:opacity-50 whitespace-nowrap shrink-0 sm:min-w-[170px] text-white"
                  style={{ backgroundColor: '#397EEF' }}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      <span className="hidden sm:inline">{t('Анализ...')}</span>
                    </span>
                  ) : (
                    <>
                      <span className="sm:hidden text-[13px] tracking-wide">{t('Анализ')}</span>
                      <span className="hidden sm:inline">{t('Анализировать')}</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Contribution Grid Animation */}
              <TypingContributionGrid query={query} />

              {/* AI Response Container */}
              <AnimatePresence>
                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-full left-0 right-0 mt-4 p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#397EEF]/20 shadow-[0_20px_40px_-15px_rgba(57,126,239,0.1)] text-left z-10"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#397EEF' }}>
                        <Sparkles size={18} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[#397EEF] mb-2">Анализ KenesHub AI</h3>
                        <p className="text-[16px] leading-[1.6] text-zinc-800 whitespace-pre-wrap">{response}</p>
                      </div>
                    </div>
                    
                    {!isError && (
                      <div className="flex justify-end pt-4 border-t border-zinc-100/50">
                        <a 
                          href="/auth/register"
                          className="py-3 px-8 rounded-xl text-[13px] uppercase tracking-[0.2em] font-bold flex items-center gap-2 hover:scale-105 transition-transform text-white"
                          style={{ backgroundColor: '#397EEF' }}
                        >
                          {t('Регистрация')} <ArrowUp className="rotate-90" size={16} />
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
          </motion.div>

          {/* Suggestion Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            {[
              { icon: Layout, label: t('Реструктуризация') },
              { icon: Globe, label: t('Консультация') },
              { icon: Code, label: t('Медиация') },
              { icon: PenTool, label: t('Жалоба') },
              { icon: MoreHorizontal, label: t('Ещё') }
            ].map((item) => (
              <button 
                key={item.label}
                className="flex items-center gap-2 px-5 py-[9px] rounded-full border border-[#397EEF]/20 bg-white hover:border-[#397EEF] hover:bg-[#397EEF]/5 transition-all text-[14px] font-medium text-[#444] hover:text-[#254C92]"
              >
                <item.icon size={16} className="text-[#397EEF]" strokeWidth={1.5} />
                {item.label}
              </button>
            ))}
          </motion.div>

        </div>
      </section>

      <ArchitectureSection />

      {/* Signature Black Section */}
      <section className="bg-[#111] py-[80px] md:py-[120px] px-6 sm:px-12 md:px-24 w-full">
        <div className="max-w-[1400px] mx-auto w-full">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
             className="break-words"
          >
            <h2 className="font-serif italic text-[40px] sm:text-[56px] md:text-[76px] text-zinc-100 leading-[0.95] tracking-tight mb-2">
              {t('Меньше бюрократии,')}
            </h2>
            <h2 className="font-serif italic text-[40px] sm:text-[56px] md:text-[76px] text-zinc-100 leading-[0.95] tracking-tight">
              {t('больше решений.')}
            </h2>
          </motion.div>
        </div>
      </section>
    </div>
  );
}