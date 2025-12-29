import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { PieChart, Home, User, FileText, LogOut, X } from "lucide-react";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="size-full flex flex-col items-center relative">
      {/* Header — СТИЛИ КАК В ПЕРВОМ КОДЕ */}
      <div className="flex items-center justify-between gap-10 mx-[16px] mt-8 w-full">
        <div className="flex items-center gap-[14px]">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center rounded-full bg-[#f4f5f7] w-[40px] h-[40px]"
          >
            <img src="/burger.svg" alt="" className="object-contain" />
          </button>
          <img src="/logo.svg" alt="" />
        </div>

        <div className="flex items-center gap-[4px]">
          <div className="flex items-center justify-center rounded-full bg-[#f4f5f7] w-[40px] h-[40px]">
            <img src="/notification.svg" alt="" className="object-contain" />
          </div>
          <img
            src="/cat.svg"
            alt=""
            className="w-[40px] h-[40px] object-cover rounded-full"
          />
        </div>
      </div>

      {/* Content — КАК В ПЕРВОМ */}
      <div className="mx-[16px]">
        <Outlet />
      </div>

      {/* Footer — КАК В ПЕРВОМ */}
      <div className="w-full h-[89px] bg-[#f5f5f5] grid justify-center items-center">
        <span className="font-normal text-[13px] leading-[150%] text-center text-[#969da6]">
          Политика конфиденциальности <br /> © 2025 ZIZ.KZ
        </span>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Burger Menu */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-white transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full px-4 py-5">
          {/* Menu Header */}
          <div className="flex items-center justify-between mb-6">
            <img src="/logo.svg" alt="logo" />
            <button onClick={() => setOpen(false)}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-1">
            <MenuItem icon={PieChart} label="Аналитика" href="/" />
            <MenuItem icon={Home} label="Главный" href="/" />
            <MenuItem icon={User} label="Профиль" href="/profile" />
            <MenuItem icon={FileText} label="Заявления" href="/requests" />
          </nav>

          {/* Bottom */}
          <div className="mt-auto">
            <button className="flex items-center gap-3 text-[#969da6] text-sm">
              <LogOut className="w-5 h-5" />
              Выйти
            </button>

            <div className="mt-6 text-[12px] text-[#b0b7c3]">
              KenesHub 2025 <br />
              Все права защищены
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  href,
}: {
  icon: any;
  label: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="flex items-center px-3 py-3 rounded-lg hover:bg-[#f4f5f7]"
    >
      <div className="flex items-center gap-3 text-[#2c2f33]">
        <Icon className="w-5 h-5 text-[#4f46e5]" />
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}
