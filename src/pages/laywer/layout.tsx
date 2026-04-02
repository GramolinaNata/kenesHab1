// import { Outlet } from "react-router-dom";

// export default function MFOayout() {
//   return (
//     <div className="min-h-screen flex justify-center">
//       <div className="w-full max-w-[420px] mx-auto px-4">
//         <Outlet />
//       </div>
//     </div>
//   );
// }




import { Outlet } from "react-router-dom";
export default function MFOayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}
