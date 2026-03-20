import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { LayoutDashboard, Package, History, BarChart3, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function DashboardLayout({ role }) {
  const mobileNav = role === 'customer' ? [
    { label: 'Home', icon: LayoutDashboard, path: '/customer/dashboard' },
    { label: 'Order', icon: Package, path: '/customer/new-order' },
    { label: 'Orders', icon: History, path: '/customer/orders' },
    { label: 'Analytics', icon: BarChart3, path: '/customer/analytics' },
    { label: 'Profile', icon: User, path: 'profile' },
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
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#343434] flex items-center justify-around px-2 py-2 z-50">
            {mobileNav.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                    isActive ? 'text-[#f2fd7d]' : 'text-[#888]'
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

export default DashboardLayout;
