import type { ReactNode } from "react";

interface AppealCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  image: string;
  href?: string;
  onClick?: () => void;
  variant?: "small" | "big";
}

export function AppealCard({
  title,
  subtitle,
  image,
  href,
  onClick,
  variant = "small",
}: AppealCardProps) {
  const Container = href ? "a" : "div";

  return (
    <Container
      href={href}
      onClick={onClick}
      className={`relative rounded-[19px] bg-[#f4f5f7] border border-[#e0e1e2] cursor-pointer p-4 flex flex-col justify-between`}
      style={{ height: variant === "big" ? "130px" : "195px" }}
    >
      <div className="flex flex-col gap-2 w-[100%] z-10">
        <h3 className="text-[16px] font-bold leading-[140%]">{title}</h3>
        {subtitle && (
          <p className="text-[13px] text-[#969DA6] leading-[140%]">
            {subtitle}
          </p>
        )}
      </div>

      <img
        src={image}
        alt=""
        className="absolute right-1.5 top-[60%] transform -translate-y-1/2 w-[126px] h-[126px] object-contain"
      />
    </Container>
  );
}
  