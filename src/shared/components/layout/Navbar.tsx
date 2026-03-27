import { useLanguage } from '@/shared/lib/i18n';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { t } = useLanguage();
  return (
    <div className="fixed top-0 left-0 right-0 z-50">

      {/* Main Bar */}
      <nav className="w-full bg-white/70 backdrop-blur-md px-6 md:px-12 py-3.5 flex items-center justify-between border-b border-zinc-100/50">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between relative">
          
            <div />

          {/* Centered Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <nav className="flex items-center gap-10">
              {['Экосистема', 'Услуги', 'О платформе'].map((item) => (
                <Link 
                  key={item} 
                  to="#" 
                  className="text-[14px] font-bold text-[#666] hover:text-[#397EEF] transition-colors uppercase tracking-[0.15em] border-b-2 border-transparent hover:border-[#397EEF] pb-1"
                >
                  {t(item)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-2.5 z-10">
            <a 
              href="/auth/login" 
              className="text-white px-[14px] py-[6px] rounded-[7px] text-[13.5px] font-semibold hover:opacity-85 transition-opacity"
              style={{ backgroundColor: '#397EEF' }}
            >
              {t('Войти')}
            </a>
            <a 
              href="/auth/register" 
              className="bg-white text-[#397EEF] border border-[#397EEF] px-[14px] py-[6px] rounded-[7px] text-[13.5px] font-semibold hover:bg-[#397EEF] hover:text-white transition-all"
            >
              {t('Регистрация')}
            </a>
          </div>

        </div>
      </nav>
    </div>
  );
}