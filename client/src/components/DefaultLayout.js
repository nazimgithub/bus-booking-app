import React, { useState } from "react";
import "../resources/layout.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function DefaultLayout({ children }) {
  const navigation = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.users);
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: "ri-calendar-line",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/admin",
      icon: "ri-home-line",
    },
    {
      name: "Buses",
      path: "/admin/buses",
      icon: "ri-bus-line",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-user-line",
    },
    {
      name: "Bookings",
      path: "/admin/booking",
      icon: "ri-calendar-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];

  const menuToRender = user?.role ? adminMenu : userMenu;
  const activeRoute = window.location.pathname;

  return (
    <div className="layout-parent">
      <div className="layout-siderbar">
        <div className="siderbar-header">
          <h1 className="logo">Booking Bus</h1>
          <h1 className="role">{user?.name}</h1>
          <h3 className="role">{user?.role}</h3>
        </div>
        <div className="d-flex flex-column gap-3 justify-content-start menu">
          {menuToRender.map((menu) => (
            <div
              className={`${activeRoute === menu.path && "active-menu-item"} ${"menu-item"} `}
              onClick={() => {
                if (menu.path === "/logout") {
                  localStorage.removeItem("token");
                  navigation("/login");
                } else {
                  navigation(menu.path);
                }
              }}
            >
              <i className={menu.icon}></i>
              {!collapsed && <span>{menu.name}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="body">
        <div className="layout-header">
          {collapsed ? (
            <i
              className="ri-menu-2-fill"
              onClick={() => setCollapsed(!collapsed)}
            ></i>
          ) : (
            <i
              className="ri-close-line"
              onClick={() => setCollapsed(!collapsed)}
            ></i>
          )}
        </div>
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
