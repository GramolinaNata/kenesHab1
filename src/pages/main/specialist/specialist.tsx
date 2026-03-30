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
} from "lucide-react";

// Компонент навигации
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Как это работает", href: "#process" },
    { name: "Преимущества", href: "#features" },
    { name: "Тарифы", href: "#pricing" },
    { name: "Отзывы", href: "#testimonials" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
           
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              KenesHab
            </span>
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
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Войти
            </button>
            <button
              onClick={() => navigate("/auth/select")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
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
          <div className="md:hidden py-4 border-t border-gray-100">
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
                className="w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-left"
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

// Компонент баннера
const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
              <Cpu className="w-4 h-4" />
              <span>🤖 ИИ-платформа для урегулирования долгов</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Путь к{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                договорённости
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl">
              KenesHab — цифровой сервис досудебного урегулирования
              задолженности. ИИ автоматически составит юридически грамотное
              заявление по нормам законодательства РК.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  10,000+
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Обращений обработано
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  87%
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Успешных решений
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  3 мин
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Среднее время создания
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/auth/login")}
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>Начать бесплатно</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-all border border-gray-200 flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5" />
                <span>Как это работает</span>
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Без проверки</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Паспорт РК</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>От 18 лет</span>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px]">
              {/* Abstract visualization */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-3xl" />

              {/* Floating cards */}
              <div className="absolute top-10 left-10 w-64 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Заявление сгенерировано</div>
                    <div className="text-sm text-gray-500">
                      ИИ обработал данные
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">3 минуты назад</div>
              </div>

              <div className="absolute bottom-10 right-10 w-64 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Подписано ЭЦП</div>
                    <div className="text-sm text-gray-500">
                      Документ готов к отправке
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="30%"
                  y1="30%"
                  x2="70%"
                  y2="70%"
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="5 5"
                  className="opacity-30"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Компонент проблемы
const ProblemSection = () => {
  const problems = [
    {
      icon: TrendingUp,
      title: "Рост задолженности",
      description:
        "Просроченные кредиты растут, а вместе с ними — штрафы и пени, усугубляя финансовое положение.",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: FileWarning,
      title: "Нет единого механизма",
      description:
        "Отсутствие универсального инструмента для досудебного урегулирования споров с кредиторами.",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: AlertCircle,
      title: "Сложность процедур",
      description:
        "Запутанные банковские процессы и необходимость знания юридических тонкостей законодательства РК.",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Award,
      title: "Высокая стоимость юристов",
      description:
        "Услуги профессиональных юристов часто недоступны для людей, уже находящихся в тяжелой ситуации.",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section id="problem" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>⚠️ Проблема</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Почему заёмщикам{" "}
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              сложно
            </span>
          </h2>
          <p className="text-gray-600">
            Миллионы казахстанцев столкнулись с проблемной задолженностью, но не
            знают как защитить свои права
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className="group relative bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${problem.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
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

// Компонент процесса
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
    <section id="process" className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>🔧 Процесс</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Как это{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              работает
            </span>
          </h2>
          <p className="text-gray-600">
            Четыре простых шага от проблемы к решению — всё автоматизировано
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
                  {/* Number */}
                  <div className="text-4xl font-bold text-blue-100 mb-4 group-hover:text-blue-200 transition-colors">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step indicator */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
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

// Компонент преимуществ
const FeaturesSection = () => {
  const features = [
    {
      icon: Cpu,
      title: "ИИ-генерация документов",
      description:
        "Искусственный интеллект формирует юридически грамотные заявления на основе законодательства РК.",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: ShieldCheck,
      title: "Интеграция с ЭЦП",
      description:
        "Подписывайте документы электронной цифровой подписью прямо на платформе через NCALayer.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Landmark,
      title: "Единое окно подачи",
      description:
        "Отправляйте заявления в любой банк, МФО или коллекторское агентство через одну платформу.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Bell,
      title: "Уведомления о статусе",
      description:
        "Получайте уведомления о ходе рассмотрения вашего обращения в реальном времени.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Zap,
      title: "Быстрая обработка",
      description:
        "Заявление формируется за 3 минуты вместо нескольких дней ожидания у юриста.",
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      icon: PieChart,
      title: "Аналитика обращений",
      description:
        "Отслеживайте историю всех обращений, статусы и результаты в личном кабинете.",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>✨ Преимущества</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Всё что нужно в{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              одном месте
            </span>
          </h2>
          <p className="text-gray-600">
            Передовые технологии для защиты ваших прав — просто, быстро и
            юридически грамотно
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Компонент тарифов
const PricingSection = () => {
  const plans = [
    {
      name: "Базовый",
      price: "Бесплатно",
      period: "/ документ",
      description: "Для первых шагов",
      features: ["Подача заявления", "Базовые шаблоны", "Просмотр статуса"],
      popular: false,
      cta: "Начать бесплатно",
    },
    {
      name: "Стандарт",
      price: "3 000 ₸",
      period: "/ документ",
      description: "Оптимальный выбор",
      features: [
        "Подача заявления",
        "Ускоренное рассмотрение",
        "ИИ-генерация документов",
        "Email-уведомления",
      ],
      popular: true,
      cta: "Выбрать тариф",
    },
    {
      name: "Про",
      price: "7 000 ₸",
      period: "/ документ",
      description: "Полное сопровождение",
      features: [
        "Ускоренное рассмотрение",
        "Помощь юриста",
        "Безлимитные заявления",
        "Приоритетная поддержка",
        "ЭЦП-подпись",
      ],
      popular: false,
      cta: "Выбрать тариф",
    },
  ];

  return (
    <section id="pricing" className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>💎 Тарифы</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Начните бесплатно или выберите план с{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              расширенными возможностями
            </span>
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all ${
                plan.popular
                  ? "ring-2 ring-blue-500 scale-105 md:scale-105"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Популярный
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-gray-500 mb-1">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Компонент отзывов
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Азамат К.",
      role: "Заемщик",
      content:
        "Был долг в трех МФО, не знал как подступиться. Сервис помог составить грамотные заявления, и в одном случае даже списали пеню. Очень удобно!",
      rating: 5,
    },
    {
      name: "Мадина С.",
      role: "Предприниматель",
      content:
        "Для меня было важно быстро решить вопрос с банком. ИИ подготовил документ за пару минут, поддержка ответила на все мои вопросы. Рекомендую.",
      rating: 5,
    },
    {
      name: "Берик Т.",
      role: "Заемщик",
      content:
        "Честно говоря, не верил, что это сработает. Но после отправки заявления банк предложил реструктуризацию. Спасибо команде KenesHab!",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            <span>💬 Отзывы</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Что говорят наши{" "}
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              пользователи
            </span>
          </h2>
          <p className="text-gray-600">
            Мы уже помогли тысячам людей найти общий язык с кредиторами и
            облегчить долговую нагрузку.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-4 line-clamp-4">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
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
    {
      question: "Как работает сервис KenesHab?",
      answer:
        "KenesHab — это цифровая платформа, которая использует искусственный интеллект для автоматического составления юридически грамотных заявлений для досудебного урегулирования задолженности. Вы заполняете анкету, ИИ формирует документ, вы подписываете его ЭЦП и отправляете кредитору через платформу.",
    },
    {
      question: "Сколько стоит использование платформы?",
      answer:
        "У нас есть бесплатный тариф для базовых заявлений, а также платные тарифы с расширенными возможностями: 'Стандарт' (3 000 ₸/документ) и 'Про' (7 000 ₸/документ) с полным сопровождением и помощью юриста.",
    },
    {
      question: "Какие документы нужны для начала работы?",
      answer:
        "Вам потребуется паспорт РК, данные о кредитном договоре (номер, дата, сумма), информация о кредиторе (банк, МФО), а также ЭЦП для подписания документов через NCALayer.",
    },
    {
      question: "Как быстро составляется заявление?",
      answer:
        "ИИ формирует готовое заявление в среднем за 3 минуты. Это значительно быстрее, чем обращение к юристу, которое может занять несколько дней.",
    },
    {
      question: "Что такое ЭЦП и где её взять?",
      answer:
        "ЭЦП (электронная цифровая подпись) — это аналог собственноручной подписи в электронном виде. В Казахстане её можно получить в любом ЦОНе или через приложение eGov mobile. Наша платформа интегрирована с NCALayer для удобного подписания.",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>❓ FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Часто задаваемые{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              вопросы
            </span>
          </h2>
          <p className="text-gray-600">
            Всё, что вам нужно знать о работе сервиса KenesHab
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronRight
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? "rotate-90" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Компонент футера
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              
              <span className="text-xl font-bold">KenesHab</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Цифровой сервис досудебного урегулирования задолженности с
              использованием ИИ.
            </p>
            <div className="flex gap-4">
              {/* Social icons placeholder */}
              <div className="w-8 h-8 bg-gray-800 rounded-lg" />
              <div className="w-8 h-8 bg-gray-800 rounded-lg" />
              <div className="w-8 h-8 bg-gray-800 rounded-lg" />
            </div>
          </div>

          {/* Links */}
          <div className="col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="#process"
                    className="hover:text-white transition-colors"
                  >
                    Как это работает
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Преимущества
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Тарифы
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Документация
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Контакты
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Юридическое</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Политика конфиденциальности
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Условия использования
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Публичная оферта
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          © 2026 KenesHab. Все права защищены.
        </div>
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
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />

      {/* Global Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
