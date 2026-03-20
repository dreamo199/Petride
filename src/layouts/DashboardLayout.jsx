import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { LayoutDashboard, Package, History, BarChart3, User, Truck } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function DashboardLayout({ role }) {
  const mobileNav = role === 'customer' ? [
    { label: 'Home', icon: LayoutDashboard, path: '/customer/dashboard' },
    { label: 'Order', icon: Package, path: '/customer/new-order' },
    { label: 'Orders', icon: History, path: '/customer/orders' },
    { label: 'Analytics', icon: BarChart3, path: '/customer/analytics' },
    { label: 'Profile', icon: User, path: 'profile' },
  ] : role === 'driver' ? [
    { label: "Dashboard", icon: LayoutDashboard, path: "/driver/dashboard" },
    { label: "Available Orders", icon: Package, path: "/driver/available-orders" },
    { label: "Active Delivery", icon: Truck, path: "/driver/active-order" },
    { label: "Earnings", icon: BarChart3, path: "/driver/earnings" },
    { label: "Profile", icon: User, path: "profile" },
  ] : [];

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar role={role} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        {mobileNav.length > 0 && (
          <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
            <nav className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#343434] rounded-2xl flex items-center justify-around px-2 py-2 shadow-2xl shadow-black/50">
              {mobileNav.map(({ label, icon: Icon, path }) => (
                <NavLink
                  key={label}
                  to={path}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#f2fd7d]/10 text-[#f2fd7d]'
                        : 'text-[#666] hover:text-[#888]'
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-medium">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardLayout;
