import { useState } from "react";

export function SelectWidget() {
  const [active, setActive] = useState("Заемщик");
  const [expandedLawyer, setExpandedLawyer] = useState(false);
  const [expandedCreditor, setExpandedCreditor] = useState(false);

  const mainStatuses = [
    {
      name: "Заемщик",
      link: "/auth/register/client",
      type: "main",
    },
    {
      name: "ЮРИСТ",
      link: "/auth/register/lawyer?lawyer",
      type: "main",
      hasSubcategories: true,
    },
    {
      name: "Кредитор",
      link: "/auth/register/creditor?creditor",
      type: "main",
      hasSubcategories: true,
    },
  ];

  const lawyerSubcategories = [
    {
      name: "Медиатор",
      link: "/auth/register/lawyer?mediator",
      parent: "ЮРИСТ",
    },
    {
      name: "Омбудсмен",
      link: "/auth/register/lawyer?ombudsman",
      parent: "ЮРИСТ",
    },
  ];

  const creditorSubcategories = [
    {
      name: "Банк",
      link: "/auth/register/creditor?bank",
      parent: "Кредитор",
    },
    {
      name: "МФО",
      link: "/auth/register/creditor?mfo",
      parent: "Кредитор",
    },
  ];

  const allStatuses = [
    ...mainStatuses,
    ...lawyerSubcategories,
    ...creditorSubcategories,
  ];

  const activeLink = allStatuses.find((s) => s.name === active)?.link || "#";

  const handleLawyerClick = () => {
    setActive("ЮРИСТ");
    setExpandedLawyer(!expandedLawyer);
    // Закрываем кредитор если открыт
    if (expandedCreditor) setExpandedCreditor(false);
  };

  const handleCreditorClick = () => {
    setActive("Кредитор");
    setExpandedCreditor(!expandedCreditor);
    // Закрываем юриста если открыт
    if (expandedLawyer) setExpandedLawyer(false);
  };

  const handleSubcategoryClick = (name: string) => {
    setActive(name);
  };

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
              {mainStatuses.map((item) => (
                <div key={item.name}>
                  <div
                    onClick={
                      item.name === "ЮРИСТ"
                        ? handleLawyerClick
                        : item.name === "Кредитор"
                          ? handleCreditorClick
                          : () => setActive(item.name)
                    }
                    className={`flex items-center gap-[12px] rounded-[10px] px-[16px] py-[12px] cursor-pointer transition-colors duration-200 bg-white
                      ${
                        active === item.name ||
                        (item.name === "ЮРИСТ" && expandedLawyer) ||
                        (item.name === "Кредитор" && expandedCreditor)
                          ? "border border-[#1F74EC]"
                          : "border border-[#E6E6E6] hover:border-[#1F74EC]"
                      }`}
                  >
                    <div className="min-w-[60px] min-h-[60px] rounded-[10px] bg-[repeating-linear-gradient(135deg,_#FF7E7E_0px,_#FF7E7E_2px,_transparent_2px,_transparent_8px)]" />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[16px] leading-[20px] break-words">
                        {item.name}
                      </p>
                    </div>

                    {item.hasSubcategories && (
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          (item.name === "ЮРИСТ" && expandedLawyer) ||
                          (item.name === "Кредитор" && expandedCreditor)
                            ? "rotate-180"
                            : ""
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
                  </div>

                  {/* Подкатегории юриста */}
                  {item.name === "ЮРИСТ" && expandedLawyer && (
                    <div className="ml-8 mt-2 space-y-2">
                      {lawyerSubcategories.map((sub) => (
                        <div
                          key={sub.name}
                          onClick={() => handleSubcategoryClick(sub.name)}
                          className={`flex items-center gap-[12px] rounded-[10px] px-[16px] py-[10px] cursor-pointer transition-colors duration-200 bg-white
                            ${
                              active === sub.name
                                ? "border border-[#1F74EC]"
                                : "border border-[#E6E6E6] hover:border-[#1F74EC]"
                            }`}
                        >
                          <div className="min-w-[40px] min-h-[40px] rounded-[8px] bg-[repeating-linear-gradient(135deg,_#FF7E7E_0px,_#FF7E7E_2px,_transparent_2px,_transparent_8px)]" />

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[14px] leading-[18px] break-words">
                              {sub.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Подкатегории кредитора */}
                  {item.name === "Кредитор" && expandedCreditor && (
                    <div className="ml-8 mt-2 space-y-2">
                      {creditorSubcategories.map((sub) => (
                        <div
                          key={sub.name}
                          onClick={() => handleSubcategoryClick(sub.name)}
                          className={`flex items-center gap-[12px] rounded-[10px] px-[16px] py-[10px] cursor-pointer transition-colors duration-200 bg-white
                            ${
                              active === sub.name
                                ? "border border-[#1F74EC]"
                                : "border border-[#E6E6E6] hover:border-[#1F74EC]"
                            }`}
                        >
                          <div className="min-w-[40px] min-h-[40px] rounded-[8px] bg-[repeating-linear-gradient(135deg,_#FF7E7E_0px,_#FF7E7E_2px,_transparent_2px,_transparent_8px)]" />

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[14px] leading-[18px] break-words">
                              {sub.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
