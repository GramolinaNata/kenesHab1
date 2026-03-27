import { Instagram, Globe, ChevronDown, Check, Phone, Mail, MessageCircle } from 'lucide-react';

import { useState } from 'react';
import { useLanguage } from '@/shared/lib/i18n';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  const sections = [
    {
      title: 'Компания',
      links: ['О нас', 'Контакты', 'Безопасность', 'Условия использования', 'Политика конфиденциальности']
    }
  ];

  return (
    <footer className="bg-[#111] text-white pt-24 pb-12 px-12 md:px-24">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 mb-20">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[14.5px] font-bold text-white mb-6 tracking-tight">{t(section.title)}</h3>
              <ul className="space-y-3.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link 
                      to="#" 
                      className="text-[13.5px] text-[#777] hover:text-[#397EEF] transition-colors"
                    >
                      {t(link)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media */}
          <div className="col-span-1">
            <h3 className="text-[14.5px] font-bold text-white mb-6 tracking-tight">{t('Социальные сети')}</h3>
            <div className="flex items-center gap-5">
              <Link to="https://www.instagram.com/keneshub.kz?igsh=MWowejN4b3p3OTN1aw==" target="_blank" className="text-[#777] hover:text-[#397EEF] transition-colors" title="Instagram"><Instagram size={20} /></Link>
              <Link to="https://www.tiktok.com/@kenesgroup.kz?_r=1&_t=ZS-94irF1uM5jc" target="_blank" className="text-[#777] hover:text-[#397EEF] transition-colors relative flex items-center justify-center pt-0.5" title="TikTok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91 0 .08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.32-2.43-.2-3.41.49-.6.41-1.01 1.07-1.11 1.8-.07.65.06 1.32.35 1.9.33.71.98 1.25 1.71 1.51.72.26 1.5.21 2.23-.06.77-.28 1.41-.88 1.73-1.62.27-.57.35-1.2.35-1.84.05-4.4.01-8.81.02-13.22z"/></svg>
              </Link>
            </div>
          </div>

          {/* Contact Us */}
          <div className="col-span-1">
            <h3 className="text-[14.5px] font-bold text-white mb-6 tracking-tight">{t('Связаться с нами')}</h3>
            <div className="flex flex-wrap items-center gap-5 mb-8">
              <Link to="https://wa.me/77770000000" target="_blank" className="text-[#777] hover:text-[#25D366] transition-colors" title="WhatsApp"><MessageCircle size={20} /></Link>
              <Link to="tel:+77770000000" className="text-[#777] hover:text-[#397EEF] transition-colors" title={t('Телефон')}><Phone size={20} /></Link>
              <Link to="mailto:info@keneshub.kz" className="text-[#777] hover:text-[#397EEF] transition-colors" title="Email"><Mail size={20} /></Link>
            </div>

            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] border border-zinc-800 bg-zinc-900/40 hover:border-[#397EEF] hover:bg-[#397EEF]/10 transition-all cursor-pointer"
              >
                <Globe size={15} className="text-[#777] group-hover:text-[#397EEF]" />
                <span className="text-[13px] font-medium text-[#ccc] min-w-[60px] text-left">
                  {language === 'ru' ? 'Русский' : 'Қазақша'}
                </span>
                <ChevronDown size={15} className={`text-[#777] transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)}></div>
                  <div className="absolute bottom-[110%] left-0 w-[140px] bg-[#222] border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-20">
                    <button 
                      onClick={() => { setLanguage('ru'); setLangOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] text-[#ccc] hover:bg-[#397EEF] hover:text-white transition-colors"
                    >
                      Русский {language === 'ru' && <Check size={14} />}
                    </button>
                    <button 
                      onClick={() => { setLanguage('kk'); setLangOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] text-[#ccc] hover:bg-[#397EEF] hover:text-white transition-colors border-t border-zinc-800"
                    >
                      Қазақша {language === 'kk' && <Check size={14} />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        <div className="pt-10 border-t border-zinc-800/80 mb-10"></div>

      </div>
    </footer>
  );
}