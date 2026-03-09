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
  HomeMFO,
  MFOLayout,
  ShowAppealsMFO,
  HomeLaywer,
  ShowAppealsLaywer,
  HomeMediator,
  ShowAppealsMediator,
  HomeOmbudsman,
  ShowAppealsOmbudsman,
  Profile,
  RegisterCreditor,
  RegisterLawyer,
} from "../lib/route";

import { ProtectedRoute, AuthRoute } from "../components/ProtectedRoute";
import ApplicationId from "@/pages/main/application/id/application";

export const routes: RouteObject[] = [
  {
    // 1. ПУБЛИЧНЫЕ МАРШРУТЫ (Только для неавторизованных)
    element: <AuthRoute />,
    children: [
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register/client", element: <RegisterClient /> },
          { path: "register/creditor", element: <RegisterCreditor /> },
          { path: "register/lawyer", element: <RegisterLawyer /> },
          { path: "select", element: <Select /> },
        ],
      },
    ],
  },
  {
    // 2. ОБЩИЕ ЗАЩИЩЕННЫЕ МАРШРУТЫ (Для всех авторизованных)
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "profile", element: <Profile /> },
          { path: "application/:id", element: <ApplicationId /> },
        ],
      },
      {
        path: "/detali",
        element: <DetaliLayout />,
        children: [
          { path: "create/statement", element: <CreateStatment /> },
          { path: "create/mediator", element: <CreateMediator /> },
          { path: "create/lawyer", element: <CreateLawyer /> },
          { path: "create/ombudsman", element: <CreateOmbudsman /> },
          { path: "show/appeals", element: <ShowAppeals /> },
        ],
      },

      // 3. РОЛЕВЫЕ МАРШРУТЫ (Пример с проверкой ролей)
      // Если ваш ProtectedRoute поддерживает роли, добавьте их в пропсы:
      {
        path: "/mfo",
        // element: <ProtectedRoute allowedRoles={['MFO']} />,
        children: [
          {
            element: <MFOLayout />,
            children: [
              { path: "home", element: <HomeMFO /> },
              { path: "show/appeals", element: <ShowAppealsMFO /> },
            ],
          },
        ],
      },
      {
        path: "/lawyer",
        children: [
          {
            element: <MFOLayout />, // Используем ваш лейаут
            children: [
              { path: "home", element: <HomeLaywer /> },
              { path: "show/appeals", element: <ShowAppealsLaywer /> },
            ],
          },
        ],
      },
      {
        path: "/mediator",
        children: [
          {
            element: <MFOLayout />,
            children: [
              { path: "home", element: <HomeMediator /> },
              { path: "show/appeals", element: <ShowAppealsMediator /> },
            ],
          },
        ],
      },
      {
        path: "/ombudsman",
        children: [
          {
            element: <MFOLayout />,
            children: [
              { path: "home", element: <HomeOmbudsman /> },
              { path: "show/appeals", element: <ShowAppealsOmbudsman /> },
            ],
          },
        ],
      },
    ],
  },
];
