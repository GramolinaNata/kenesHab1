import { lazy } from "react";

// Auth компоненты
export const RegisterClient = lazy(() => import("../../pages/auth/register/client"));
export const Login = lazy(() => import("../../pages/auth/login/login"));
export const Select = lazy(() => import("../../pages/auth/select/select"));

// Main компоненты
export const Home = lazy(() => import("../../pages/main/home/home"));

//Detali Компоненты
export const CreateStatment = lazy(() => import("../../pages/detali/statement/create-statement"));
export const CreateMediator = lazy(() => import("../../pages/detali/mediator/create-mediator"));
export const CreateLawyer = lazy(() => import("../../pages/detali/lawyer/create-lawyer"));
export const CreateOmbudsman = lazy(() => import("../../pages/detali/ombudsman/create-ombudsman"));

export const ShowAppeals = lazy(() => import("../../pages/detali/appeals/show/show-appeals"));

// Layout компоненты
export const AuthLayout = lazy(() => import("../../pages/auth/layout"));
export const MainLayout = lazy(() => import("../../pages/main/layout"));
export const DetaliLayout = lazy(() => import("../../pages/detali/layout"));