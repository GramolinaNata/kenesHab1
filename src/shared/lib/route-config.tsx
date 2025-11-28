import type { RouteObject } from "react-router-dom";
import {
  AuthLayout,
  MainLayout,
  Login,
  Home,
  Select,
  RegisterClient,
  DetaliLayout,
  CreateStatment,
  CreateMediator,
  CreateLawyer,
  CreateOmbudsman,
  ShowAppeals,
} from "../lib/route";

export const routes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register/client", element: <RegisterClient /> },
      { path: "select", element: <Select /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "/detali",
    element: <DetaliLayout />,
    children: [
      { path: "create/statement", element: <CreateStatment /> },
      {
        path: "create/mediator",
        element: <CreateMediator />,
      },
      {
        path: "create/lawyer",
        element: <CreateLawyer />,
      },
      {
        path: "create/ombudsman",
        element: <CreateOmbudsman />,
      },
      {
        path: "show/appeals",
        element: <ShowAppeals />,
      },
    ],
  },
];
