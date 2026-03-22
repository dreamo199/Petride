import { Search, Bell, LogOut, ChevronDown, X, UserCircle, Settings, HelpCircle, History, BarChart3 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import User from "../assets/User.png";
import { Link } from "react-router-dom";

function Header() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef = useRef(null);

  const role = user?.user?.role;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const signOut = () => {
    logout();
    setShowUserMenu(false);
  };

  const menuItems = role === 'driver' ? [
    { icon: UserCircle, label: 'My Profile', path: '/driver/profile' },
    { icon: History, label: 'Delivery History', path: '/driver/history' },
    { icon: BarChart3, label: 'Earnings', path: '/driver/earnings' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
  ] : [
    { icon: UserCircle, label: 'My Profile', path: '/customer/profile' },
    { icon: History, label: 'My Orders', path: '/customer/orders' },
    { icon: BarChart3, label: 'Analytics', path: '/customer/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
  ];

  const notifications = [
    { id: 1, title: "Order confirmed", description: "Your order has been placed successfully", time: "5 min ago", unread: true },
    { id: 2, title: "Driver assigned", description: "A driver has been assigned to your order", time: "1 hour ago", unread: true },
    { id: 3, title: "Delivery completed", description: "Your fuel has been delivered", time: "2 hours ago", unread: false },
  ];

  return (
    <>
      <div className="bg-black flex items-center justify-between px-4 md:px-10 py-5 border-b border-[#343434]/30">

        {/* Search Bar */}
        <div className={`flex items-center gap-3 bg-black border rounded-lg px-4 py-2.5 w-full max-w-[380px] transition-all duration-300 ${
          searchFocused
            ? 'border-[#f2fd7d] shadow-lg shadow-[#f2fd7d]/10'
            : 'border-[#343434] hover:border-[#4a4a4a]'
        }`}>
          <Search size={18} className={`transition-colors ${searchFocused ? 'text-[#f2fd7d]' : 'text-white'}`} />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-sm text-white placeholder:text-[#b2beb5] outline-none flex-1 font-switzer"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2.5 rounded-lg hover:bg-[#343434]/50 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Bell size={20} className="text-white" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f2fd7d] rounded-full animate-pulse" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#343434]/50 transition-all duration-300"
            >
              <img
                src={User}
                alt="avatar"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-transparent hover:ring-[#f2fd7d] transition-all duration-300"
              />
              <div className="leading-tight text-left hidden md:block">
                <p className="font-satoshi text-sm font-semibold text-white">
                  {user?.user?.first_name || 'User'}
                </p>
                <p className="font-switzer text-xs text-[#b2beb5]">
                  {user?.user?.email || 'user@example.com'}
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`text-[#b2beb5] transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0a0a0a] border border-[#343434] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">

                {/* User Info */}
                <div className="px-4 py-4 border-b border-[#1f1f1f]">
                  <div className="flex items-center gap-3">
                    <img src={User} alt="avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#f2fd7d]/30" />
                    <div>
                      <p className="font-satoshi text-white font-semibold text-sm">
                        {user?.user?.first_name} {user?.user?.last_name}
                      </p>
                      <p className="font-switzer text-[#555] text-xs">{user?.user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#f2fd7d]/10 border border-[#f2fd7d]/20 rounded-full text-[#f2fd7d] text-[10px] font-switzer capitalize">
                        {role || 'customer'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {menuItems.map(({ icon: Icon, label, path }) => (
                    <Link
                      key={label}
                      to={path}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#888] hover:text-white hover:bg-[#141414] transition-all group"
                    >
                      <Icon size={16} className="group-hover:text-[#f2fd7d] transition-colors shrink-0" />
                      <span className="font-switzer">{label}</span>
                    </Link>
                  ))}
                </div>

                {/* Sign Out */}
                <div className="border-t border-[#1f1f1f] py-2">
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                  >
                    <LogOut size={16} />
                    <span className="font-switzer">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowNotifications(false)}
          />

          <div className="relative bg-[#0a0a0a] border border-[#343434] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1f1f1f]">
              <div>
                <h2 className="font-satoshi text-xl font-semibold text-white">
                  Notifications
                </h2>
                <p className="font-switzer text-sm text-[#b2beb5] mt-1">
                  {notifications.filter(n => n.unread).length} unread
                </p>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 rounded-lg hover:bg-[#1f1f1f] transition-colors"
              >
                <X size={20} className="text-[#b2beb5]" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[440px] overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-5 border-b border-[#1f1f1f] hover:bg-[#111] transition-colors cursor-pointer ${n.unread ? 'bg-[#111]/50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-[#f2fd7d]' : 'bg-transparent'}`} />
                    <div className="flex-1">
                      <p className="font-satoshi text-sm font-semibold text-white mb-1">{n.title}</p>
                      <p className="font-switzer text-sm text-[#b2beb5] mb-2">{n.description}</p>
                      <p className="font-switzer text-xs text-[#555]">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#1f1f1f] bg-[#0a0a0a]">
              <button className="w-full font-switzer text-sm text-[#f2fd7d] hover:text-[#f2fd7d]/80 transition-colors font-medium">
                Mark all as read
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;