import React from "react";
import { Routes, Route } from "react-router-dom";
import { RoutesData } from "./routes";

const Menu = () => {
  const routesdata = RoutesData();
  return (
    <>
      <main id="main" className="main">
        <Routes>
          {routesdata.map((routes, index) => (
            <Route key={index} path={routes.path} element={routes.Component} />
          ))}
        </Routes>
      </main>
    </>
  );
};

export default Menu;
