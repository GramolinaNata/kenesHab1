import { Outlet } from "react-router-dom";

export default function DetaliLayout() {
  return (
    <div className="size-full flex flex-col items-center">
      <Outlet />
    </div>
  );
}
