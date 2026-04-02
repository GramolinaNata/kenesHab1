// import { LabeledInput } from "@/shared";
// import ComplaintCard from "@/shared/components/block/ComplaintCard";

// import { BellRing } from "lucide-react";

// export default function Home() {
//   return (
//     <div>
//       <div>
//         <div className="flex items-center justify-around mt-5">
//           <div className="flex items-center gap-2.5">
//             <img
//               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuJpp3XhMaWsHmwSNbS-smmCmIER3aHmB0Qw&s"
//               alt=""
//               className="w-10 h-10 rounded-full object-cover"
//             />
//             <div>
//               <p className="font-semibold text-[18px] text-[#343942]">Юрист</p>
//               <p className="font-medium text-[12px] text-[#626b79]">
//                 Добро Пожаловать Юрист
//               </p>
//             </div>
//           </div>

//           <div className="w-10 h-10 bg-[#d1ebfa] rounded-full grid items-center justify-center">
//             <BellRing className="text-[#1f74ec]" />
//           </div>
//         </div>
//         <div className="mt-3">
//           <img src="/zaimer.svg" alt="" />
//         </div>
//         <div className="mt-3">
//           <LabeledInput placeholder="Поиск: Обращение" />
//         </div>
//         <div className="flex justify-between items-center mt-3">
//           <span className="text-black font-semibold text-[22px]">
//             Обращение
//           </span>
//           <span className="text-[#1f74ec] text-[12px] font-bold">
//             Подробнее
//           </span>
//         </div>
//         <div className="flex items-center gap-2.5 mt-3">
//           <div className="bg-[#1f74ec] rounded-[15px] w-[90px] h-[31px] text-white text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
//             Новые
//           </div>
//           <div className="bg-[#f5f5f5] rounded-[15px] w-[90px] h-[31px] text-black text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
//             В работе
//           </div>
//           <div className="bg-[#f5f5f5] rounded-[15px] w-[120px] h-[31px] text-black text-[14px] font-bold flex justify-center items-center -translate-y-[1px]">
//             Завершенные
//           </div>
//         </div>
//         <div className="mt-3.5 grid items-center gap-3">
//           <ComplaintCard />
//           <ComplaintCard />
//           <ComplaintCard />
//           <ComplaintCard />
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { BellRing, Bookmark, Search, FileText, Clock, CheckCircle } from "lucide-react";

const MOCK_COMPLAINTS = [
  {
    id: 1042,
    title: "Жалоба на начисление лишних процентов по микрозайму.",
    org: "МФО «CrediFast»",
    status: "В работе",
    created: "10.10.2025",
    deadline: "17.10.2025",
    docs: 2,
  },
  {
    id: 1043,
    title: "Жалоба на неправомерное списание средств.",
    org: "МФО «KazCredit»",
    status: "Новые",
    created: "12.10.2025",
    deadline: "19.10.2025",
    docs: 1,
  },
  {
    id: 1044,
    title: "Жалоба на отказ в реструктуризации долга.",
    org: "МФО «FinHelp»",
    status: "Завершённые",
    created: "05.10.2025",
    deadline: "12.10.2025",
    docs: 3,
  },
  {
    id: 1045,
    title: "Жалоба на повышение процентной ставки без уведомления.",
    org: "МФО «CrediFast»",
    status: "В работе",
    created: "08.10.2025",
    deadline: "15.10.2025",
    docs: 0,
  },
];

const TABS = ["Новые", "В работе", "Завершённые"];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  "Новые": { color: "bg-blue-100 text-blue-700", icon: <FileText className="w-3 h-3" /> },
  "В работе": { color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3 h-3" /> },
  "Завершённые": { color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3 h-3" /> },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("Новые");
  const [search, setSearch] = useState("");

  const filtered = MOCK_COMPLAINTS.filter((c) => {
    const matchTab = activeTab === "Новые" ? true : c.status === activeTab;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.org.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuJpp3XhMaWsHmwSNbS-smmCmIER3aHmB0Qw&s"
              alt=""
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <p className="font-semibold text-[16px] text-[#343942]">Юрист</p>
              <p className="font-medium text-[12px] text-[#626b79]">Добро Пожаловать Юрист</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
              <input
                type="text"
                placeholder="Поиск обращений..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-sm w-64 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
              <BellRing className="text-blue-600 h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Banner */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-md border border-blue-100">
          <img src="/zaimer.svg" alt="" className="w-full h-40 object-cover" />
        </div>

        {/* Title + tabs */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Обращения</h1>
          <span className="text-blue-600 text-sm font-semibold cursor-pointer hover:underline">Подробнее</span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white text-gray-600 border border-blue-100 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-blue-100">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">Нет обращений</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => {
              const s = statusConfig[c.status] || statusConfig["Новые"];
              return (
                <div
                  key={c.id}
                  className="group bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <p className="font-semibold text-[15px] text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </p>
                  <p className="text-gray-500 text-[12px] font-medium mb-3">
                    Жалоба №{c.id} — {c.org}
                  </p>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${s.color}`}>
                    {s.icon}
                    {c.status}
                  </span>

                  <div className="text-gray-400 text-[12px] flex items-center gap-2 mt-3 pt-3 border-t border-blue-50 pb-3">
                    <span>Создано {c.created}</span>
                    <span>•</span>
                    <span>До {c.deadline}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Bookmark className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-500 text-[12px]">{c.docs} документа</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-3 h-[28px] text-white text-[12px] font-semibold transition-colors shadow-sm shadow-blue-200">
                        Новые
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-3 h-[28px] text-white text-[12px] font-semibold transition-colors shadow-sm shadow-blue-200">
                        Новые
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}