import React from "react";
import "../resources/layout.css";
import { useNavigate } from "react-router-dom";

function DefaultLayout({ children }) {
  const navigation = useNavigate();
  const userMenu = [];
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
      path: "/admin/bookings",
      icon: "ri-calendar-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];

  const menuToRender = adminMenu;
  const activeRoute = window.location.pathname;

  return (
    <div className="layout-parent">
      <div className="layout-siderbar">
        <div className="d-flex flex-column gap-3 justify-content-start">
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
              <span>{menu.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="body">
        <div className="layout-header">Header</div>
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
