'use client';

import { useLanguage } from '@/shared/lib/i18n';
import { motion } from 'framer-motion';
import { User, Building2, Briefcase, Scale, Users, MessageSquare, ShieldCheck } from 'lucide-react';

export default function ArchitectureSection() {
  const { t } = useLanguage();

  const actors = [
    { id: 'creditor', name: 'Кредитор', desc: 'Банк / МФО', icon: Building2, items: ['Запрос на КП', 'Чат',], color: 'bg-blue-50/30 border border-[#397EEF]/10 hover:border-[#397EEF]/30' },
    { id: 'collector', name: 'Коллектор', desc: 'Агентство', icon: Briefcase, items: ['Отклик КП', 'Чат', ], color: 'bg-blue-50/30 border border-[#397EEF]/10 hover:border-[#397EEF]/30' },
    { id: 'lawyer', name: 'Юрист', desc: 'Защита', icon: Scale, items: ['Консультации', 'Суд', 'Защита'], color: 'bg-white border border-[#397EEF]/10 hover:border-[#397EEF]/30' },
    { id: 'ombudsman', name: 'Омбудсмен', desc: 'Медиатор', icon: Users, items: ['Медиация', 'Соглашение'], color: 'bg-white border border-[#397EEF]/10 hover:border-[#397EEF]/30' },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden border-t border-zinc-100">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
             <ShieldCheck size={18} className="text-[#397EEF]" />
             <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#397EEF]">{t('Архитектура системы')}</span>
          </div>
          <h2 className="font-serif text-[40px] md:text-[56px] text-black leading-tight tracking-tight">
            {t('Экосистема урегулирования')}
          </h2>
          <p className="text-[16px] text-zinc-400 mt-4 max-w-[600px] font-medium">
            {t('Прозрачное взаимодействие между всеми участниками процесса реструктуризации долга в Казахстане.')}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Hero Card (The Borrower) - Takes 5 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-between min-h-[400px]"
            style={{ backgroundColor: '#254C92' }}
          >
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8">
                <User size={28} className="text-white" />
              </div>
              <h3 className="font-serif text-[32px] md:text-[40px] font-bold leading-tight mb-4 italic">
                {t('Заёмщик')}
              </h3>
              <p className="text-zinc-300 text-[16px] leading-relaxed max-w-[300px]">
                {t('Центральный узел')}. {t('Все запросы и взаимодействие начинаются отсюда.')}
              </p>
            </div>
            
            <div className="relative z-10 flex gap-4 mt-8 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[12px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <MessageSquare size={14} className="text-zinc-300" /> {t('Чат')}
              </div>
        
            </div>

            {/* Decorative Pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
          </motion.div>

          {/* Right Grid - Takes 7 columns */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {actors.map((actor, i) => (
              <motion.div
                key={actor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${actor.color} rounded-[28px] p-8 group hover:shadow-xl transition-all duration-500`}
                style={{ 
                  boxShadow: '0 4px 14px 0 rgba(57, 126, 239, 0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 35px -10px rgba(57, 126, 239, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(57, 126, 239, 0.05)';
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-[#397EEF] transition-colors border border-zinc-100">
                    <actor.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[17px] font-bold text-black tracking-tight leading-none mb-1">{t(actor.name)}</h4>
                    <p className="text-[11px] text-[#397EEF] font-bold uppercase tracking-widest leading-none">{t(actor.desc)}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-black/5">
                  {actor.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-[13px] font-semibold text-zinc-500 group-hover:text-[#254C92] transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#397EEF]/30 group-hover:bg-[#397EEF] transition-colors" />
                      {t(item)}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Capabilities Small Bar */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-12 border-t border-zinc-100">
          {[
            { label: 'Децентрализация', text: 'Без хранения портфелей' },
            { label: 'Нейтральность', text: 'Без участия в расчётах' },
            { label: 'Авторитет сервиса', text: 'Технический оператор' }
          ].map((item, i) => (
            <div key={i}>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#397EEF] mb-2">{t(item.label)}</p>
              <p className="text-[14px] text-zinc-500 font-serif italic">{t(item.text)}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}