import { SideBar } from "@/containers/navigation/SideBar";
import { TopBar } from "@/containers/navigation/TopBar";
import { MenuContext } from "@/context/menuContext";
import React, { useEffect, useState } from "react";

export const MainLayout = ({ children }) => {
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setShowMenu(false);
    }
  }, []);

  return (
    <MenuContext.Provider value={{ showMenu, setShowMenu }}>
      <div className={`sidebar-container ${showMenu ? "active" : ""}`}>
        <SideBar></SideBar>
      </div>
      <div
        className={`menu-backdrop ${showMenu ? "active" : ""}`}
        onClick={() => setShowMenu(false)}
      />
      <div className="top-bar-main-area-container">
        <div className="top-bar-container">
          <TopBar></TopBar>
        </div>
        <div className="main-container">{children}</div>
      </div>
    </MenuContext.Provider>
  );
};
