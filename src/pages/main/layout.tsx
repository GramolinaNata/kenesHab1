import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="size-full flex flex-col items-center">
      <div className="flex items-center justify-between gap-10 mx-[16px] mt-8">
        <div className="flex items-center gap-[14px]">
          <div className="flex items-center justify-center rounded-full bg-[#f4f5f7] w-[40px] h-[40px]">
            <img src="/burger.svg" alt="" className="object-contain" />
          </div>
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
      <div className="mx-[16px]">
        <Outlet />
      </div>
      <div className="w-full h-[89px] bg-[#f5f5f5] grid justify-center items-center ">
        <span className="font-normal text-[13px] leading-[150%] text-center text-[#969da6]">
          Политика конфиденциальности <br /> © 2025 ZIZ.KZ
        </span>
      </div>
    </div>
  );
}
