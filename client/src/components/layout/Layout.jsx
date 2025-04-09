

import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header"; // Ensure this exists
import Footer from "./Footer"; // Ensure this exists

const Layout = ({ children, hideFooter = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const showFooter = !hideFooter && isHomePage;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;




