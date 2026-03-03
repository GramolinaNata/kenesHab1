import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  PieChart,
  Home,
  User,
  FileText,
  LogOut,
  X,
  MessageCircle,
  Send,
  Bot,
  ChevronDown,
  XCircle,
  Menu,
  Loader2,
} from "lucide-react";
import { useAi } from "@/features/ui/hook/useAi";

// Тип для сообщения
type ChatMessage = {
  id: string;
  text: string;
  isBot: boolean;
  time: string;
};

export default function MainLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Привет! Я ваш помощник. Чем могу помочь?",
      isBot: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Подготавливаем данные для отправки
  const [aiQueryData, setAiQueryData] = useState<{
    message: string;
    history: Array<{ role: string; content: string }>;
  } | null>(null);

  // Используем хук useAi с включенным enabled
  const {
    data: aiData,
    refetch: sendMessage,
    isFetching: isLoading,
  } = useAi(aiQueryData?.message, aiQueryData?.history);

  // Автопрокрутка к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Обработка ответа от AI
  useEffect(() => {
    if (aiData?.reply) {
      // Добавляем ответ от AI
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiData.reply,
        isBot: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    }
  }, [aiData]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // Добавляем сообщение пользователя в UI
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Создаем историю из текущих сообщений (исключая первое приветственное)
    const history = messages
      .filter((msg) => msg.id !== "1") // Исключаем первое приветственное сообщение
      .map((msg) => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.text,
      }));

    // Добавляем текущее сообщение в историю
    const newHistory = [...history, { role: "user", content: message }];

    // Устанавливаем данные для отправки
    setAiQueryData({
      message,
      history: newHistory,
    });

    setMessage("");
  };

  // Отправляем запрос при изменении aiQueryData
  useEffect(() => {
    if (aiQueryData?.message) {
      sendMessage();
    }
  }, [aiQueryData]);

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: "Привет! Я ваш помощник. Чем могу помочь?",
        isBot: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setAiQueryData(null);
  };

  // Функция выхода
  const handleLogout = () => {
    // Очищаем весь localStorage
    localStorage.clear();

    // Закрываем sidebar
    setOpen(false);

    // Перенаправляем на страницу входа
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 active:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <img src="/logo.png" alt="" />
          </div>

          {/* <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 active:bg-gray-100">
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2"></div>
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full"></div>
          </div> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">
            Политика конфиденциальности
          </p>
          <p className="text-xs text-gray-400">© 2025 ZIZ.KZ</p>
        </div>
      </footer>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar */}
          <aside className="absolute top-0 left-0 h-full w-64 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <img src="/logo.png" alt="" />
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 active:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Menu */}
              <nav className="flex-1 p-3">
                <div className="space-y-1">
                  <MenuItem
                    icon={PieChart}
                    label="Аналитика"
                    href="/"
                    onClick={() => setOpen(false)}
                  />
                  <MenuItem
                    icon={Home}
                    label="Главный"
                    href="/"
                    onClick={() => setOpen(false)}
                  />
                  <MenuItem
                    icon={User}
                    label="Профиль"
                    href="/profile"
                    onClick={() => setOpen(false)}
                  />
                  <MenuItem
                    icon={FileText}
                    label="Заявления"
                    href="/requests"
                    onClick={() => setOpen(false)}
                  />
                </div>
              </nav>

              {/* Bottom */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-gray-500 hover:text-gray-700 active:text-gray-800 p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Выйти</span>
                </button>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">KenesHub 2025</p>
                  <p className="text-xs text-gray-400">Все права защищены</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Chat Bot Button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setChatOpen(false)}
          />

          {/* Chat Container */}
          <div className="absolute bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-2xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Помощник</h3>
                    <p className="text-xs text-white/90">Онлайн</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearChat}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20"
                  >
                    <ChevronDown className="w-4 h-4 text-white/90" />
                  </button>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20"
                  >
                    <XCircle className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.isBot
                          ? "bg-white border border-gray-200 rounded-tl-none shadow-sm"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p
                        className={`text-xs mt-2 ${msg.isBot ? "text-gray-400" : "text-white/80"}`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Индикатор загрузки */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white border border-gray-200 rounded-tl-none shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                        <span className="text-sm text-gray-600">
                          AI думает...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-100 bg-white"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">
                AI может допускать ошибки. Проверяйте важную информацию.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: any;
  label: string;
  href: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className="flex items-center px-3 py-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
    </Link>
  );
}
