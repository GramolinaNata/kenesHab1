import { useState } from "react";

export function SelectWidget() {
  const [active, setActive] = useState("Клиент");

  const statuses = [
    {
      name: "Клиент",
      desc: "Exclusive analytics for smart decisions, staying ahead in your workflow",
      link: "/auth/register/client",
    },
    {
      name: "Медиатор",
      desc: "Simplify leave requests. Track and approve effortlessly in the app",
      link: "/auth/register/workshop",
    },
    {
      name: "ОМБУДСМЕН",
      desc: "From advanced task tracking to complete project management tools",
      link: "/admin",
    },
    {
      name: "ЮРИСТ",
      desc: "From advanced task tracking to complete project management tools",
      link: "/admin",
    },
    {
      name: "МФО",
      desc: "From advanced task tracking to complete project management tools",
      link: "/auth/register/creditor?mfo",
    },
  ];

  const activeLink = statuses.find((s) => s.name === active)?.link || "#";

  return (
    <div className="bg-[#1F74EC] w-full min-h-screen flex flex-col items-center pt-6">
      <div className="bg-white w-full max-w-md flex-1 rounded-t-2xl p-5 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="grid">
              <span className="font-semibold text-[22px]">Регистрация</span>
              <span className="pt-[20px] font-medium text-[14px] text-[#969da6]">
                ВЫБРАТЬ СТАТУС
              </span>
            </div>

            <div className="grid gap-[14px] pb-4">
              {statuses.map((item) => (
                <div
                  key={item.name}
                  onClick={() => setActive(item.name)}
                  className={`flex items-center gap-[12px] rounded-[10px] px-[16px] py-[12px] cursor-pointer transition-colors duration-200 bg-white
                    ${
                      active === item.name
                        ? "border border-[#1F74EC]"
                        : "border border-[#E6E6E6] hover:border-[#1F74EC]"
                    }`}
                >
                  <div className="min-w-[60px] min-h-[60px] rounded-[10px] bg-[repeating-linear-gradient(135deg,_#FF7E7E_0px,_#FF7E7E_2px,_transparent_2px,_transparent_8px)]" />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[16px] leading-[20px] break-words">
                      {item.name}
                    </p>
                    <p className="text-[13px] text-[#969da6] leading-[18px] break-words">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 pt-4">
          <div className="flex flex-col items-center gap-3">
            <a href={activeLink} className="w-full flex justify-center">
              <button className="bg-[#1F74EC] text-white font-medium rounded-[21px] w-full max-w-[313px] h-[42px] hover:bg-blue-700 transition-colors">
                Выбрать
              </button>
            </a>

            <a href="/auth/login">
              <span className="text-sm text-[#1F74EC] hover:text-blue-600 transition-colors cursor-pointer">
                У вас есть аккаунт?
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
