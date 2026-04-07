import type { ReactNode } from "react";

interface AppealCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "small" | "big";
  icon?: ReactNode;
}

export function AppealCard({
  title,
  subtitle,
  href,
  onClick,
  variant = "small",
  icon,
}: AppealCardProps) {
  const Container = href ? "a" : "div";
  const isWide = variant === "big";

  return (
    <Container
      href={href}
      onClick={onClick}
      className={`
        group bg-white rounded-[18px] border border-[#dde8f5]
        hover:border-blue-400 hover:shadow-md
        transition-all cursor-pointer flex justify-between
        ${isWide ? "flex-row items-center gap-[14px] px-[22px] py-5" : "flex-col px-[22px] py-5 min-h-[150px]"}
      `}
    >
      <div className={`flex ${isWide ? "flex-row items-center gap-4" : "flex-col"} flex-1`}>
        {icon && (
          <div className={`w-[38px] h-[38px] rounded-[10px] bg-[#EBF4FF] flex items-center justify-center text-blue-700 flex-shrink-0 ${!isWide ? "mb-3" : ""}`}>
            {icon}
          </div>
        )}
        <div>
          <p className="text-[14px] font-semibold text-[#0C447C] leading-[1.45]">{title}</p>
          {subtitle && <p className="text-[11px] text-[#93bfe0] mt-[3px]">{subtitle}</p>}
        </div>
      </div>
      <div className={`flex-shrink-0 ${!isWide ? "self-end mt-3" : ""}`}>
        <div className="w-7 h-7 rounded-full bg-[#EBF4FF] flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </Container>
  );
}