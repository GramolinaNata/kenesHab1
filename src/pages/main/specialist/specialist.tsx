import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  FileText,
  Zap,
  ArrowRight,
  CheckCircle,
  Landmark,
  Users,
  TrendingUp,
  AlertCircle,
  FileWarning,
  Award,
  Bell,
  PieChart,
  Cpu,
  Star,
  ChevronRight,
  Menu,
  X,
  PlayCircle,
  Send,
  HelpCircle,
  Search,
  XCircle,
} from "lucide-react";

// Компонент навигации
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Как это работает", href: "#process" },
    { name: "Преимущества", href: "#features" },
    { name: "Отзывы", href: "#testimonials" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-blue-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo6.png" className="h-10" />
      
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/auth/login")}
              className="px-4 py-2 text-gray-600 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              Войти
            </button>
            <button
              onClick={() => navigate("/auth/select")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-md shadow-blue-200"
            >
              Начать бесплатно
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-3 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <button
                onClick={() => {
                  navigate("/auth/login");
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-gray-600 hover:bg-blue-50 rounded-xl transition-colors text-left"
              >
                Войти
              </button>
              <button
                onClick={() => {
                  navigate("/auth/select");
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-center"
              >
                Начать бесплатно
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};


const Banner = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [isError, setIsError] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResponse("");
    setIsError(false);
    setShowResponse(true);
    
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

  const handleStartFree = async () => {
    if (query.trim()) {
      await handleAnalyze();
    } else {
      navigate("/auth/select");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleAnalyze();
    }
  };

  const closeResponse = () => {
    setShowResponse(false);
    setResponse("");
  };

  const proceedToRegister = () => {
    navigate("/auth/select");
  };

  return (
    <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Фоновые декоративные элементы */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Абстрактные круги для фона */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl" />
        
        {/* Плавающие карточки справа (только на больших экранах) */}
        <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2">
          {/* Первая карточка */}
          <div className="relative mb-6 animate-float">
            <div className="w-72 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Заявление сгенерировано</div>
                  <div className="text-sm text-gray-500">ИИ обработал данные</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">3 минуты назад</div>
              {/* Линия связи */}
              <div className="absolute -left-8 top-1/2 w-8 h-px bg-gradient-to-r from-blue-300 to-transparent" />
            </div>
          </div>

          {/* Вторая карточка */}
          <div className="relative animate-float-delayed">
            <div className="w-72 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Подписано ЭЦП</div>
                  <div className="text-sm text-gray-500">Документ готов к отправке</div>
                </div>
              </div>
              {/* Линия связи */}
              <div className="absolute -left-8 top-1/2 w-8 h-px bg-gradient-to-r from-blue-300 to-transparent" />
            </div>
          </div>
        </div>

        {/* Третья карточка снизу (опционально) */}
        <div className="hidden lg:block absolute left-4 bottom-8 animate-float-slow">
          <div className="w-64 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-semibold">Успешных решений</div>
                <div className="text-xs text-gray-500">+87% за месяц</div>
              </div>
            </div>
          </div>
        </div>

        {/* Декоративные линии */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Соединительные линии от карточек */}
          <line x1="75%" y1="35%" x2="85%" y2="40%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="75%" y1="55%" x2="85%" y2="60%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="85%" cy="40%" r="3" fill="#3b82f6" opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="85%" cy="60%" r="3" fill="#3b82f6" opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Пульсирующие точки */}
        <div className="absolute right-32 top-1/3">
          <div className="relative">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping absolute" />
            <div className="w-2 h-2 bg-blue-500 rounded-full relative" />
          </div>
        </div>
        <div className="absolute right-40 bottom-1/4">
          <div className="relative">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping absolute" />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full relative" />
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Центрированный контент */}
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6">
            <Cpu className="w-4 h-4" />
            <span>🤖 ИИ-платформа для урегулирования долгов</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
            Путь к{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              договорённости
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            KenesHab — цифровой сервис досудебного урегулирования
            задолженности. ИИ автоматически составит юридически грамотное
            заявление по нормам законодательства РК.
          </p>

          {/* Search Box */}
          <div className="relative mb-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white rounded-2xl border border-blue-200 shadow-md hover:shadow-lg transition-shadow p-1.5 pl-4">
              <Search className="w-5 h-5 text-blue-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Опишите вашу ситуацию..."
                className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 py-3"
                disabled={isLoading}
              />
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !query.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <span>Анализ...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Анализировать</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Response Modal */}
            {showResponse && response && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden z-20 text-left">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Анализ KenesHab AI</h3>
                        <p className="text-xs text-gray-500">ИИ-ассистент</p>
                      </div>
                    </div>
                    <button
                      onClick={closeResponse}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className={`p-4 rounded-xl mb-4 ${isError ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <p className={`text-sm leading-relaxed ${isError ? 'text-red-700' : 'text-gray-700'}`}>
                      {response}
                    </p>
                  </div>

                  {!isError && (
                    <button
                      onClick={proceedToRegister}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Продолжить регистрацию</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Stats - центрированные */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-100 shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-blue-700">
                10,000+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Обращений обработано
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-100 shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-blue-700">
                87%
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Успешных решений
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-100 shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-blue-700">
                3 мин
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Среднее время создания
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8">
            <button
              onClick={handleStartFree}
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2"
            >
              <span>Начать бесплатно</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => {
                const processSection = document.getElementById('process');
                if (processSection) {
                  processSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-blue-50 text-blue-700 rounded-xl font-semibold transition-all border border-blue-200 flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Как это работает</span>
            </button>
          </div>

          {/* Features chips */}
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span>Без проверки</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span>Паспорт РК</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span>От 18 лет</span>
            </div>
          </div>
        </div>
      </div>

     
    </section>
  );
};
// Компонент проблемы (бело-синяя гамма)
const ProblemSection = () => {
  const problems = [
    {
      icon: TrendingUp,
      title: "Рост задолженности",
      description:
        "Просроченные кредиты растут, а вместе с ними — штрафы и пени, усугубляя финансовое положение.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FileWarning,
      title: "Нет единого механизма",
      description:
        "Отсутствие универсального инструмента для досудебного урегулирования споров с кредиторами.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: AlertCircle,
      title: "Сложность процедур",
      description:
        "Запутанные банковские процессы и необходимость знания юридических тонкостей законодательства РК.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Award,
      title: "Высокая стоимость юристов",
      description:
        "Услуги профессиональных юристов часто недоступны для людей, уже находящихся в тяжелой ситуации.",
      color: "from-blue-500 to-blue-600",
    },
  ];

  return (
    <section id="problem" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>⚠️ Проблема</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Почему заёмщикам{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              сложно
            </span>
          </h2>
          <p className="text-gray-600">
            Миллионы казахстанцев столкнулись с проблемной задолженностью, но не
            знают как защитить свои права
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className="group relative bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-blue-100"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Компонент процесса (синие акценты)
const ProcessSection = () => {
  const steps = [
    {
      number: "01",
      title: "Заполните анкету",
      description:
        "Укажите данные о кредите, кредиторе и вашей текущей финансовой ситуации.",
      icon: FileText,
    },
    {
      number: "02",
      title: "ИИ составит заявление",
      description:
        "Искусственный интеллект сформирует юридически грамотное обращение по нормам РК.",
      icon: Cpu,
    },
    {
      number: "03",
      title: "Проверьте и подпишите",
      description:
        "Просмотрите сгенерированный документ, внесите правки и подпишите ЭЦП.",
      icon: ShieldCheck,
    },
    {
      number: "04",
      title: "Отправьте кредитору",
      description:
        "Заявление будет направлено в банк, МФО или коллекторское агентство через платформу.",
      icon: Send,
    },
  ];

  return (
    <section id="process" className="py-16 sm:py-20 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>🔧 Процесс</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Как это{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              работает
            </span>
          </h2>
          <p className="text-gray-600">
            Четыре простых шага от проблемы к решению — всё автоматизировано
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-200 to-blue-300" />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all group border border-blue-100">
                  <div className="text-4xl font-bold text-blue-100 mb-4 group-hover:text-blue-200 transition-colors">
                    {step.number}
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Компонент преимуществ (бело-синий)
const FeaturesSection = () => {
  const features = [
    { icon: Cpu, title: "ИИ-генерация документов", description: "Искусственный интеллект формирует юридически грамотные заявления на основе законодательства РК.", gradient: "from-blue-500 to-blue-600" },
    { icon: ShieldCheck, title: "Интеграция с ЭЦП", description: "Подписывайте документы электронной цифровой подписью прямо на платформе через NCALayer.", gradient: "from-blue-500 to-blue-600" },
    { icon: Landmark, title: "Единое окно подачи", description: "Отправляйте заявления в любой банк, МФО или коллекторское агентство через одну платформу.", gradient: "from-blue-500 to-blue-600" },
    { icon: Bell, title: "Уведомления о статусе", description: "Получайте уведомления о ходе рассмотрения вашего обращения в реальном времени.", gradient: "from-blue-500 to-blue-600" },
    { icon: Zap, title: "Быстрая обработка", description: "Заявление формируется за 3 минуты вместо нескольких дней ожидания у юриста.", gradient: "from-blue-500 to-blue-600" },
    { icon: PieChart, title: "Аналитика обращений", description: "Отслеживайте историю всех обращений, статусы и результаты в личном кабинете.", gradient: "from-blue-500 to-blue-600" },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>✨ Преимущества</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Всё что нужно в{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              одном месте
            </span>
          </h2>
          <p className="text-gray-600">
            Передовые технологии для защиты ваших прав — просто, быстро и
            юридически грамотно
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group relative bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden border border-blue-100">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Компонент отзывов
const TestimonialsSection = () => {
  const testimonials = [
    { name: "Азамат К.", role: "Заемщик", content: "Был долг в трех МФО, не знал как подступиться. Сервис помог составить грамотные заявления, и в одном случае даже списали пеню. Очень удобно!", rating: 5 },
    { name: "Мадина С.", role: "Предприниматель", content: "Для меня было важно быстро решить вопрос с банком. ИИ подготовил документ за пару минут, поддержка ответила на все мои вопросы. Рекомендую.", rating: 5 },
    { name: "Берик Т.", role: "Заемщик", content: "Честно говоря, не верил, что это сработает. Но после отправки заявления банк предложил реструктуризацию. Спасибо команде KenesHab!", rating: 5 },
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-20 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            <span>💬 Отзывы</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Что говорят наши{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              пользователи
            </span>
          </h2>
          <p className="text-gray-600">Мы уже помогли тысячам людей найти общий язык с кредиторами и облегчить долговую нагрузку.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all border border-blue-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? "text-blue-500 fill-blue-500" : "text-gray-300"}`} />
                ))}
              </div>
              <p className="text-gray-700 mb-4 line-clamp-4">"{testimonial.content}"</p>
              <div><div className="font-semibold">{testimonial.name}</div><div className="text-sm text-gray-500">{testimonial.role}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Компонент FAQ
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { question: "Как работает сервис KenesHab?", answer: "KenesHab — это цифровая платформа, которая использует искусственный интеллект для автоматического составления юридически грамотных заявлений для досудебного урегулирования задолженности. Вы заполняете анкету, ИИ формирует документ, вы подписываете его ЭЦП и отправляете кредитору через платформу." },
    { question: "Сколько стоит использование платформы?", answer: "У нас есть бесплатный тариф для базовых заявлений, а также платные тарифы с расширенными возможностями: 'Стандарт' (3 000 ₸/документ) и 'Про' (7 000 ₸/документ) с полным сопровождением и помощью юриста." },
    { question: "Какие документы нужны для начала работы?", answer: "Вам потребуется паспорт РК, данные о кредитном договоре (номер, дата, сумма), информация о кредиторе (банк, МФО), а также ЭЦП для подписания документов через NCALayer." },
    { question: "Как быстро составляется заявление?", answer: "ИИ формирует готовое заявление в среднем за 3 минуты. Это значительно быстрее, чем обращение к юристу, которое может занять несколько дней." },
    { question: "Что такое ЭЦП и где её взять?", answer: "ЭЦП (электронная цифровая подпись) — это аналог собственноручной подписи в электронном виде. В Казахстане её можно получить в любом ЦОНе или через приложение eGov mobile. Наша платформа интегрирована с NCALayer для удобного подписания." },
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>❓ FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Часто задаваемые{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              вопросы
            </span>
          </h2>
          <p className="text-gray-600">Всё, что вам нужно знать о работе сервиса KenesHab</p>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-blue-100">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-blue-50 transition-colors">
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronRight className={`w-5 h-5 text-blue-500 transition-transform ${openIndex === index ? "rotate-90" : ""}`} />
              </button>
              {openIndex === index && <div className="px-6 pb-4 text-gray-600 border-t border-blue-100 pt-4">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Футер
const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1">

            <div className="flex items-center gap-2 mb-4">            <img src="/logo6.png" className="h-10" /></div>
            <p className="text-sm text-blue-200 mb-4">Цифровой сервис досудебного урегулирования задолженности с использованием ИИ.</p>
            <div className="flex gap-4"><div className="w-8 h-8 bg-blue-800 rounded-lg" /><div className="w-8 h-8 bg-blue-800 rounded-lg" /><div className="w-8 h-8 bg-blue-800 rounded-lg" /></div>
          </div>
          <div className="col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div><h4 className="font-semibold mb-4">Продукт</h4><ul className="space-y-2 text-sm text-blue-200"><li><a href="#process" className="hover:text-white transition-colors">Как это работает</a></li><li><a href="#features" className="hover:text-white transition-colors">Преимущества</a></li></ul></div>
            <div><h4 className="font-semibold mb-4">Поддержка</h4><ul className="space-y-2 text-sm text-blue-200"><li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li><li><a href="#" className="hover:text-white transition-colors">Документация</a></li><li><a href="#" className="hover:text-white transition-colors">Контакты</a></li></ul></div>
            <div><h4 className="font-semibold mb-4">Юридическое</h4><ul className="space-y-2 text-sm text-blue-200"><li><a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a></li><li><a href="#" className="hover:text-white transition-colors">Условия использования</a></li><li><a href="#" className="hover:text-white transition-colors">Публичная оферта</a></li></ul></div>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-300">© 2026 KenesHab. Все права защищены.</div>
      </div>
    </footer>
  );
};

// Главный компонент страницы
export default function Specialist() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Banner />
      <ProblemSection />
      <ProcessSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}