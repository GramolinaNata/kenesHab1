import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Briefcase, Scale, Users } from 'lucide-react';

const roles = [
  {
    id: 'borrower',
    label: 'Заёмщик',
    desc: 'У меня есть просроченный долг',
    icon: User,
    href: '/auth/register/client',
  },
  {
    id: 'lawyer',
    label: 'ЮРИСТ',
    desc: 'Правовая поддержка',
    icon: Scale,
    hasSubcategories: true,
  },
  {
    id: 'creditor',
    label: 'Кредитор',
    desc: 'Банк или МФО',
    icon: Building2,
    hasSubcategories: true,
  },
];

const lawyerSubcategories = [
  {
    id: 'mediator',
    label: 'Медиатор',
    desc: 'Профессиональный медиатор',
    icon: Scale,
    href: '/auth/register/lawyer?mediator',
  },
  {
    id: 'ombudsman',
    label: 'Омбудсмен',
    desc: 'Банковский медиатор',
    icon: Users,
    href: '/auth/register/lawyer?ombudsman',
  },
];

const creditorSubcategories = [
  {
    id: 'bank',
    label: 'Банк',
    desc: 'Банковское учреждение',
    icon: Building2,
    href: '/auth/register/creditor?bank',
  },
  {
    id: 'mfo',
    label: 'МФО',
    desc: 'Микрофинансовая организация',
    icon: Briefcase,
    href: '/auth/register/creditor?mfo',
  },
];

export function SelectWidget() {
  const [active, setActive] = useState<string | null>(null);
  const [expandedLawyer, setExpandedLawyer] = useState(false);
  const [expandedCreditor, setExpandedCreditor] = useState(false);
  const navigate = useNavigate();

  const handleLawyerClick = () => {
    setActive(null);
    setExpandedLawyer(!expandedLawyer);
    if (expandedCreditor) setExpandedCreditor(false);
  };

  const handleCreditorClick = () => {
    setActive(null);
    setExpandedCreditor(!expandedCreditor);
    if (expandedLawyer) setExpandedLawyer(false);
  };

  const handleRoleSelect = (roleId: string, href?: string) => {
    setActive(roleId);
    if (href) {
      setTimeout(() => {
        navigate(href);
      }, 300);
    }
  };

  const handleSubcategorySelect = (sub: any) => {
    setActive(sub.id);
    setTimeout(() => {
      navigate(sub.href);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[500px]"
      >
        {/* Logo */}
 <div className="relative flex justify-center mb-12">
  <a href="/dashboard" className="relative w-full h-16">
    <img
      src="/logo1.png"
      alt="logo"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-auto object-contain"
    />
  </a>
</div>

        <div className="text-center mb-12">
          <h1 className="font-serif text-[40px] text-black leading-tight tracking-tight">
            Регистрация
          </h1>
          <p className="text-[14px] text-zinc-400 font-medium mt-2">
            Выберите ваш статус в экосистеме
          </p>
        </div>

        {/* Role selection */}
        <div className="grid grid-cols-1 gap-3 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            const isExpanded = (role.id === 'lawyer' && expandedLawyer) || (role.id === 'creditor' && expandedCreditor);
            
            return (
              <div key={role.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (role.id === 'lawyer') handleLawyerClick();
                    else if (role.id === 'creditor') handleCreditorClick();
                    else handleRoleSelect(role.id, role.href);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    active === role.id || isExpanded
                      ? 'border-[#397EEF] bg-blue-50'
                      : 'border-zinc-100 hover:border-[#397EEF] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      active === role.id || isExpanded ? 'bg-[#397EEF] text-white' : 'bg-zinc-50 text-zinc-400'
                    }`}>
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <div className="text-left">
                      <p className={`text-[15px] font-bold ${
                        active === role.id || isExpanded ? 'text-[#254C92]' : 'text-zinc-500'
                      }`}>
                        {role.label}
                      </p>
                      <p className="text-[12px] text-zinc-400">{role.desc}</p>
                    </div>
                  </div>
                  {role.hasSubcategories && (
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 text-zinc-400 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>

                {/* Lawyer Subcategories */}
                {role.id === 'lawyer' && expandedLawyer && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-12 mt-2 space-y-2 overflow-hidden"
                    >
                      {lawyerSubcategories.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubcategorySelect(sub)}
                            className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 ${
                              active === sub.id
                                ? 'border-[#397EEF] bg-blue-50'
                                : 'border-zinc-100 hover:border-[#397EEF] bg-white'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              active === sub.id ? 'bg-[#397EEF] text-white' : 'bg-zinc-50 text-zinc-400'
                            }`}>
                              <SubIcon size={14} strokeWidth={1.5} />
                            </div>
                            <div className="text-left">
                              <p className={`text-[13px] font-bold ${
                                active === sub.id ? 'text-[#254C92]' : 'text-zinc-500'
                              }`}>
                                {sub.label}
                              </p>
                              <p className="text-[11px] text-zinc-400">{sub.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Creditor Subcategories */}
                {role.id === 'creditor' && expandedCreditor && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-12 mt-2 space-y-2 overflow-hidden"
                    >
                      {creditorSubcategories.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubcategorySelect(sub)}
                            className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 ${
                              active === sub.id
                                ? 'border-[#397EEF] bg-blue-50'
                                : 'border-zinc-100 hover:border-[#397EEF] bg-white'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              active === sub.id ? 'bg-[#397EEF] text-white' : 'bg-zinc-50 text-zinc-400'
                            }`}>
                              <SubIcon size={14} strokeWidth={1.5} />
                            </div>
                            <div className="text-left">
                              <p className={`text-[13px] font-bold ${
                                active === sub.id ? 'text-[#254C92]' : 'text-zinc-500'
                              }`}>
                                {sub.label}
                              </p>
                              <p className="text-[11px] text-zinc-400">{sub.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-[13px] mt-10 text-zinc-400 font-medium">
          Уже есть аккаунт?{' '}
          <a href="/auth/login" className="text-[#397EEF] font-bold border-b border-[#397EEF] pb-0.5 hover:text-[#254C92] hover:border-[#254C92] transition-colors">
            Войти
          </a>
        </p>

        <div className="mt-20 pt-10 border-t border-zinc-100 text-center">
          <a href="/dashboard" className="text-[11px] font-bold text-zinc-300 hover:text-[#397EEF] uppercase tracking-[0.2em] transition-colors">
            ← Вернуться на главную
          </a>
        </div>
      </motion.div>
    </div>
  );
}