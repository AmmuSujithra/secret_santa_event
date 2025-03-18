import { lazy } from "react";

const Home = lazy(() => import("../home"));
const Santa = lazy(() => import("../santa"));

export const RoutesData = () => {
  const Routes = [
    {
      path: "/",
      pages: "Home",
      Component: <Home />,
    },
    {
      path: "/santa",
      pages: "Santa",
      Component: <Santa />,
    },
  ];
  return Routes;
};
