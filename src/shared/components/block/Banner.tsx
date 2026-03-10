import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Shield, Clock, Percent } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Типы для данных баннера
interface BannerFeature {
  icon: LucideIcon;
  text: string;
}

interface BannerDataType {
  images: string[];
  banner_text: string;
  banner_subtext: string;
  button_text: string;
  button_url: string;
  features: BannerFeature[];
  amount: string;
  time: string;
  rate: string;
}

// Локальные данные для баннера займов
const BANNER_DATA: BannerDataType = {
  images: [
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200",
    "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=1200",
  ],
  banner_text: "БЫСТРЫЕ ЗАЙМЫ ОНЛАЙН",
  banner_subtext: "До 30 000 ₽ за 5 минут на карту",
  button_text: "Оформить заявку",
  button_url: "/auth/login",
  features: [
    { icon: Zap, text: "Мгновенное одобрение" },
    { icon: Percent, text: "Ставка от 0.8%" },
    { icon: Shield, text: "Без скрытых комиссий" },
    { icon: Clock, text: "Круглосуточно 24/7" },
  ],
  amount: "30 000 ₽",
  time: "5 мин",
  rate: "0.8%",
};

// Типы для компонентов
interface SkeletonProps {
  className?: string;
}

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

// Компонент Skeleton
const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`animate-pulse bg-gray-200 ${className}`} />
);

// Компонент Typography
const Typography = ({
  children,
  className = "",
  as: Component = "p",
}: TypographyProps) => {
  const Element = Component;
  return <Element className={className}>{children}</Element>;
};

// Компонент Button
const Button = ({
  children,
  className = "",
  onClick,
  variant = "primary",
}: ButtonProps) => {
  const baseStyles =
    "rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 w-full sm:w-auto";
  const variants = {
    primary:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl",
    secondary:
      "bg-white hover:bg-gray-100 text-emerald-600 border-2 border-emerald-500",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function Banner() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bannerData, setBannerData] = useState<BannerDataType | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBannerData(BANNER_DATA);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (bannerData?.images?.length && bannerData.images.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerData.images.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [bannerData?.images?.length]);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-[600px] sm:h-[500px] w-full rounded-2xl sm:rounded-3xl" />
      </div>
    );
  }

  if (!bannerData || bannerData.images.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative h-[600px] sm:h-[500px] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-500 to-blue-500">
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center text-white">
              <Typography className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold">
                БЫСТРЫЕ ЗАЙМЫ
              </Typography>
              <Typography className="mb-6 text-lg sm:text-xl">
                До 30 000 ₽ за 5 минут
              </Typography>
              <Button onClick={() => navigate("/auth")}>Получить деньги</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200";
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="relative h-[600px] sm:h-[500px] w-full overflow-hidden rounded-2xl sm:rounded-3xl">
        {/* Фоновые изображения */}
        {bannerData.images.map((imageUrl, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={imageUrl}
              alt={`Баннер ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={handleError}
            />
          </div>
        ))}

        {/* Затемнение для читаемости */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/50 sm:to-transparent" />

        {/* Контент баннера */}
        <div className="absolute inset-0 z-10 flex items-end sm:items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl text-white pb-8 sm:pb-0">
              {/* Главный заголовок */}
              <Typography
                className="mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold animate-fade-in"
                as="h1"
              >
                {bannerData.banner_text}
              </Typography>

              {/* Подзаголовок */}
              {bannerData.banner_subtext && (
                <Typography className="mb-4 text-lg sm:text-xl md:text-2xl text-emerald-300 font-semibold">
                  {bannerData.banner_subtext}
                </Typography>
              )}

              {/* Основные преимущества в цифрах */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                <div className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-2 sm:p-3">
                  <Typography
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400"
                    as="div"
                  >
                    {bannerData.amount}
                  </Typography>
                  <Typography className="text-xs sm:text-sm text-gray-300">
                    Сумма
                  </Typography>
                </div>
                <div className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-2 sm:p-3">
                  <Typography
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400"
                    as="div"
                  >
                    {bannerData.time}
                  </Typography>
                  <Typography className="text-xs sm:text-sm text-gray-300">
                    Время
                  </Typography>
                </div>
                <div className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-2 sm:p-3">
                  <Typography
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400"
                    as="div"
                  >
                    {bannerData.rate}
                  </Typography>
                  <Typography className="text-xs sm:text-sm text-gray-300">
                    Ставка
                  </Typography>
                </div>
              </div>

              {/* Преимущества с иконками */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {bannerData.features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 sm:gap-2 bg-black/20 backdrop-blur-sm rounded-lg p-2"
                    >
                      <div className="p-1.5 bg-emerald-500/20 rounded-lg shrink-0">
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                      </div>
                      <Typography className="text-xs sm:text-sm font-medium line-clamp-2">
                        {feature.text}
                      </Typography>
                    </div>
                  );
                })}
              </div>

              {/* Кнопки действий */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    if (bannerData.button_url) {
                      navigate(bannerData.button_url);
                    } else {
                      navigate("/auth/login");
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{bannerData.button_text}</span>
                  </div>
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => navigate("/auth/login")}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Percent className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Рассчитать платеж</span>
                  </div>
                </Button>
              </div>

              {/* Дополнительная информация */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-300">
                <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Без проверки КИ</span>
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                  Паспорт РФ
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                  От 18 лет
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Индикаторы слайдов */}
        {bannerData.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {bannerData.images.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-6 bg-emerald-500"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
