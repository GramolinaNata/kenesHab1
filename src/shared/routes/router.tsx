import { useRoutes } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "../lib";
import PageLoader from "../components/page-loader";

export default function Router() {
  const routing = useRoutes(routes);

  return <Suspense fallback={<PageLoader />}>{routing}</Suspense>;
}
