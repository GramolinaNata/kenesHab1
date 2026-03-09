import { lazy } from "react";

// Auth компоненты
export const RegisterClient = lazy(() => import("../../pages/auth/register/client"));
export const Login = lazy(() => import("../../pages/auth/login/login"));
export const Select = lazy(() => import("../../pages/auth/select/select"));
export const RegisterCreditor = lazy(() => import("../../pages/auth/register/creditor"));
export const RegisterLawyer = lazy(() => import("../../pages/auth/register/lawyer"));

// Main компоненты
export const Home = lazy(() => import("../../pages/main/home/home"));
export const Profile = lazy(() => import("../../pages/main/profile/profile"));
export const ApplicationId = lazy(() => import("../../pages/main/application/id/application"));
export const Lawyer = lazy(() => import("../../pages/main/lawyer/lawyer"));

//Detali Компоненты
export const CreateStatment = lazy(() => import("../../pages/detali/statement/create-statement"));
export const CreateMediator = lazy(() => import("../../pages/detali/mediator/create-mediator"));
export const CreateLawyer = lazy(() => import("../../pages/detali/lawyer/create-lawyer"));
export const CreateOmbudsman = lazy(() => import("../../pages/detali/ombudsman/create-ombudsman"));

export const ShowAppeals = lazy(() => import("../../pages/detali/appeals/show/show-appeals"));

//MFO Компоненты
export const HomeMFO = lazy(() => import("../../pages/mfo/home/home"));

//Detali MFO Компоненты
export const ShowAppealsMFO = lazy(() => import("../../pages/mfo/home/detali/Appeals"));

//Laywer Компоненты
export const HomeLaywer = lazy(() => import("../../pages/laywer/home/home"));

//Detali Laywer Компоненты
export const ShowAppealsLaywer = lazy(() => import("../../pages/laywer/home/detali/Appeals"));
//Mediator Компоненты
export const HomeMediator = lazy(() => import("../../pages/mediator/home/home"));

//Detali Mediator Компоненты
export const ShowAppealsMediator = lazy(() => import("../../pages/mediator/home/detali/Appeals"));
//Ombudsman Компоненты
export const HomeOmbudsman = lazy(() => import("../../pages/ombudsman/home/home"));

//Detali Ombudsman Компоненты
export const ShowAppealsOmbudsman = lazy(() => import("../../pages/ombudsman/home/detali/Appeals"));

// Layout компоненты
export const AuthLayout = lazy(() => import("../../pages/auth/layout"));
export const MainLayout = lazy(() => import("../../pages/main/layout"));
export const DetaliLayout = lazy(() => import("../../pages/detali/layout"));
export const MFOLayout = lazy(() => import("../../pages/mfo/layout"));