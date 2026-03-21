import { Search, Bell, LogOut, ChevronDown, X, UserCircle, Package, BarChart3, Settings, HelpCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import User from "../assets/User.png";
import { Link } from "react-router-dom";

function Header() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const signOut = () => {
    logout();
  };

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "New message received",
      description: "You have a new message from John Doe",
      time: "5 min ago",
      unread: true
    },
    {
      id: 2,
      title: "Task completed",
      description: "Your report has been successfully generated",
      time: "1 hour ago",
      unread: true
    },
    {
      id: 3,
      title: "System update",
      description: "A new version is available for download",
      time: "2 hours ago",
      unread: false
    }
  ];

  return (
    <>
      <div className="bg-black flex items-center justify-between px-4 md:px-10 py-5 border-b border-[#343434]/30">
        {/* Search Bar */}
        <div 
          className={`flex items-center gap-3 bg-black border rounded-lg px-4 py-2.5 w-full max-w-[380px] transition-all duration-300 ${
            searchFocused 
              ? 'border-[#f2fd7d] shadow-lg shadow-[#f2fd7d]/10' 
              : 'border-[#343434] hover:border-[#4a4a4a]'
          }`}
        >
          <Search size={18} className={`transition-colors ${searchFocused ? 'text-[#f2fd7d]' : 'text-white'}`} />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-sm text-white placeholder:text-[#b2beb5] outline-none flex-1"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2.5 rounded-lg hover:bg-[#343434]/50 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f2fd7d] rounded-full animate-pulse" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#343434]/50 transition-all duration-300"
            >
              <img
                src={User}
                alt="User avatar"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-transparent hover:ring-[#f2fd7d] transition-all duration-300"
              />
              <div className="leading-tight text-left hidden md:block">
                <p className="text-sm font-semibold text-white">
                  {user?.user.first_name || "User"}
                </p>
                <p className="text-xs text-[#b2beb5]">
                  {user?.user.email || "user@example.com"}
                </p>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-[#b2beb5] transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0a0a0a] border border-[#343434] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                
                {/* User Info */}
                <div className="px-4 py-4 border-b border-[#1f1f1f]">
                  <div className="flex items-center gap-3">
                    <img src={User} alt="avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#f2fd7d]/30" />
                    <div>
                      <p className="text-white font-semibold text-sm">{user?.user.first_name || 'User'}</p>
                      <p className="text-[#555] text-xs">{user?.user.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {[
                    { icon: UserCircle, label: 'My Profile', path: 'profile' }, 
                    { icon: Settings, label: 'Settings', path: '/settings' },
                    { icon: HelpCircle, label: 'Support', path: '/support' },
                  ].map(({ icon: Icon, label, path }) => (
                    <Link
                      key={label}
                      to={path}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#888] hover:text-white hover:bg-[#141414] transition-all group"
                    >
                      <Icon size={16} className="group-hover:text-[#f2fd7d] transition-colors" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>

                {/* Divider + Sign Out */}
                <div className="border-t border-[#1f1f1f] py-2">
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all group"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowNotifications(false)}
          />
          
          {/* Notification Panel */}
          <div className="relative bg-[#1a1a1a] border border-[#343434] rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#343434]">
              <div>
                <h2 className="text-xl font-semibold text-white font-['Manrope',sans-serif]">
                  Notifications
                </h2>
                <p className="text-sm text-[#b2beb5] mt-1">
                  You have {notifications.filter(n => n.unread).length} unread notifications
                </p>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 rounded-lg hover:bg-[#343434] transition-colors"
                aria-label="Close notifications"
              >
                <X size={20} className="text-[#b2beb5]" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-5 border-b border-[#343434] hover:bg-[#232323] transition-colors cursor-pointer ${
                      notification.unread ? 'bg-[#232323]/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.unread ? 'bg-[#f2fd7d]' : 'bg-transparent'
                      }`} />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white mb-1 font-['Manrope',sans-serif]">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-[#b2beb5] mb-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-[#888]">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <Bell size={48} className="text-[#343434] mx-auto mb-3" />
                  <p className="text-[#b2beb5] text-sm">No notifications yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-[#343434] bg-[#141414]">
                <button className="w-full text-sm text-[#f2fd7d] hover:text-[#f2fd7d]/80 transition-colors font-medium">
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;