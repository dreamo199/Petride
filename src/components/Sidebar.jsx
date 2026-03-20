import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  User,
  BarChart3,
  History,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

function Sidebar({ role }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuByRole = () => {
    if (role === "admin") {
      return [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { id: "orders", label: "Orders", icon: Package, path: "/admin/orders" },
        { id: "customers", label: "Customers", icon: Users, path: "/admin/customers" },
        { id: "drivers", label: "Drivers", icon: Truck, path: "/admin/drivers" },
        { id: "analytics", label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
      ];
    } else if (role === "driver") {
      return [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/driver/dashboard" },
        { id: "available-orders", label: "Available Orders", icon: Package, path: "/driver/available-orders" },
        { id: "active-order", label: "Active Delivery", icon: Truck, path: "/driver/active-order" },
        { id: "earnings", label: "Earnings", icon: BarChart3, path: "/driver/earnings" },
        { id: "history", label: "History", icon: History, path: "/driver/history" },
        { id: "profile", label: "Profile", icon: User, path: "profile" },
      ];
    } else {
      return [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/customer/dashboard" },
        { id: "new-order", label: "New Order", icon: Package, path: "/customer/new-order" },
        { id: "orders", label: "My Orders", icon: History, path: "/customer/orders" },
        { id: "analytics", label: "Analytics", icon: BarChart3, path: "/customer/analytics" },
        { id: "profile", label: "Profile", icon: User, path: "profile" },
      ];
    }
  };

  const generalMenu = [
    { label: "Settings", icon: Settings, path: "/settings" },
    { label: "Support", icon: HelpCircle, path: "/support" },
  ];

  return ( 
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="
        bg-[#0a0a0a]
        flex flex-col
        sticky top-0 left-0
        h-screen
        overflow-hidden
        transition-all duration-300 ease-in-out
        shadow-lg shadow-black/30
        z-30
      "
      style={{ width: isExpanded ? "220px" : "72px" }}
    >

      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-6 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          {/* Logo circle always visible */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg  shrink-0">
            <span className="text-white text-sm font-bold">PR</span>
          </div>

          {/* Full logo text - fades in/out */}
          <span
            className="
              text-white text-lg font-semibold
              transition-all duration-300 ease-in-out
              overflow-hidden whitespace-nowrap
            "
            style={{
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? "120px" : "0px",
              maxWidth: isExpanded ? "120px" : "0px",
            }}
          >
            PetRide
          </span>
        </div>
        <div
          className="
            transition-all duration-300 ease-in-out
            overflow-hidden
          "
          style={{
            opacity: isExpanded ? 1 : 0,
            width: isExpanded ? "20px" : "0px",
          }}
        >
          <ChevronRight
            size={16}
            className="text-[#b2beb5] rotate-180"
          />
        </div>
      </div>

      {/* Menu Section */}
      <div className="mb-6 shrink-0">
        <p
          className="
            text-[#b2beb5] text-xs uppercase tracking-wider
            px-4 mb-3
            transition-all duration-300 ease-in-out
            overflow-hidden whitespace-nowrap
          "
          style={{
            opacity: isExpanded ? 1 : 0,
            height: isExpanded ? "16px" : "0px",
            marginBottom: isExpanded ? "12px" : "0px",
          }}
        >
          Menu
        </p>

        <nav className="flex flex-col gap-1 px-2">
          {menuByRole().map(({ label, icon: Icon, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `
                  relative flex items-center gap-3
                  rounded-lg
                  transition-all duration-200 ease-in-out
                  group
                  ${isActive ? "bg-[#343434]" : "hover:bg-[#343434]/50"}
                `
              }
              style={{
                padding: isExpanded ? "10px 16px" : "10px 0",
                justifyContent: isExpanded ? "flex-start" : "center",
              }}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-full" />
                  )}

                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-white" : "text-[#b2beb5] group-hover:text-white"
                    }`}
                  />

                  {/* Label - slides in/out */}
                  <span
                    className="
                      text-sm font-medium
                      transition-all duration-300 ease-in-out
                      overflow-hidden whitespace-nowrap
                    "
                    style={{
                      opacity: isExpanded ? 1 : 0,
                      width: isExpanded ? "auto" : "0px",
                      maxWidth: isExpanded ? "200px" : "0px",
                      color: isActive ? "white" : "",
                    }}
                  >
                    {label}
                  </span>

                  {/* Tooltip when collapsed */}
                  {!isExpanded && (
                    <div className="
                      absolute left-[56px] top-1/2 -translate-y-1/2
                      bg-[#1f1f1f] border border-[#343434]
                      text-white text-xs font-medium
                      px-3 py-1.5 rounded-md
                      opacity-0 group-hover:opacity-100 pointer-events-none
                      transition-opacity duration-200
                      whitespace-nowrap shadow-lg
                    ">
                      {label}
                      {/* Tooltip arrow */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-[#1f1f1f] border-l border-b border-[#343434]" />
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#343434] mb-4 shrink-0" />

      {/* General Section */}
      <div className="shrink-0">
        <p
          className="
            text-[#b2beb5] text-xs uppercase tracking-wider
            px-4
            transition-all duration-300 ease-in-out
            overflow-hidden whitespace-nowrap
          "
          style={{
            opacity: isExpanded ? 1 : 0,
            height: isExpanded ? "16px" : "0px",
            marginBottom: isExpanded ? "12px" : "0px",
          }}
        >
          General
        </p>

        <div className="flex flex-col gap-1 px-2">
          {generalMenu.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={label}
              to={path}
              className="
                relative flex items-center gap-3
                px-4 py-2.5 rounded-lg
                text-[#b2beb5] hover:text-white hover:bg-[#343434]/50
                transition-all duration-200 ease-in-out
                group
              "
              style={{
                padding: isExpanded ? "10px 16px" : "10px 0",
                justifyContent: isExpanded ? "flex-start" : "center",
              }}
            >
              <Icon size={18} className="shrink-0" />

              <span
                className="
                  text-sm
                  transition-all duration-300 ease-in-out
                  overflow-hidden whitespace-nowrap
                "
                style={{
                  opacity: isExpanded ? 1 : 0,
                  width: isExpanded ? "auto" : "0px",
                  maxWidth: isExpanded ? "200px" : "0px",
                }}
              >
                {label}
              </span>

              {/* Tooltip when collapsed */}
              {!isExpanded && (
                <div className="
                  absolute left-[56px] top-1/2 -translate-y-1/2
                  bg-[#1f1f1f] border border-[#343434]
                  text-white text-xs font-medium
                  px-3 py-1.5 rounded-md
                  opacity-0 group-hover:opacity-100 pointer-events-none
                  transition-opacity duration-200
                  whitespace-nowrap shadow-lg
                ">
                  {label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-[#1f1f1f] border-l border-b border-[#343434]" />
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;