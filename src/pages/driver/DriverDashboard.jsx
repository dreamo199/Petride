import { Link } from 'react-router-dom';
import { Package, Droplets, Star, Power, MapPin, Clock, Fuel, ArrowRight, Zap, RefreshCw, TrendingUp, Navigation } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { driverService } from '../../services/driver';
import { orderService } from '../../services/order';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [stats, setStats] = useState({
    total_deliveries: 0, total_liters_delivered: 0, total_distance: 0,
    average_rating: 0, available_orders: 0, active_deliveries: 0, currency: '₦',
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);

  useEffect(() => { loadUserProfile(); loadDashboardData(); }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await driverService.getDriverProfile();
      setIsAvailable(profile.is_available);
    } catch { toast.error('Failed to load profile'); }
  };

  const loadDashboardData = async () => {
    try {
      const [dashboardData, orderData, recentOrder] = await Promise.all([
        driverService.getAnalytics(), driverService.availableOrders(), orderService.getOrders()
      ]);
      setStats({
        total_deliveries: dashboardData.overview?.total_deliveries || 0,
        total_liters_delivered: dashboardData.performance?.total_liters_delivered || 0,
        total_distance: dashboardData.performance?.total_distance_km || 0,
        average_rating: dashboardData.ratings?.current_rating || 0,
        available_orders: orderData?.length || 0,
        active_deliveries: dashboardData.overview?.active_deliveries || 0,
        currency: '₦',
      });
      if (recentOrder?.results) setRecentDeliveries(recentOrder.results.slice(0, 5));
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  const handleToggleAvailability = async () => {
    if (updatingAvailability) return;
    const newStatus = !isAvailable;
    try {
      setUpdatingAvailability(true);
      await driverService.updateAvailability();
      setIsAvailable(newStatus);
      toast.success(newStatus ? 'You are now online' : 'You are now offline');
    } catch { toast.error('Failed to update availability'); }
    finally { setUpdatingAvailability(false); }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
        <p className="font-switzer text-[#555]">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-5 pb-24 lg:pb-6 overflow-x-hidden">

      {/* Hero Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Welcome Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl p-7 sm:p-8"
          style={{ background: '#080808', border: '1px solid #1a1a1a' }}>

          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle, #1e1e1e 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(242,253,125,0.25), transparent)' }} />
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 100% 0%, rgba(74,222,128,0.06) 0%, transparent 70%)' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-400 animate-pulse' : 'bg-[#333]'}`} />
              <span className={`font-switzer text-xs tracking-widest uppercase font-semibold ${isAvailable ? 'text-green-400' : 'text-[#444]'}`}>
                {isAvailable ? 'Online & available' : 'Offline'}
              </span>
            </div>

            <h1 className="font-technor font-black text-3xl sm:text-4xl text-white mb-3 leading-tight">
              {getGreeting()},<br />{user?.user?.first_name || 'Driver'}
            </h1>

            <p className="font-switzer text-[#444] text-sm max-w-md mb-5">
              {isAvailable
                ? stats.active_deliveries > 0
                  ? `${stats.active_deliveries} active ${stats.active_deliveries === 1 ? 'delivery' : 'deliveries'} in progress`
                  : stats.available_orders > 0
                    ? `${stats.available_orders} ${stats.available_orders === 1 ? 'order is' : 'orders are'} waiting for you`
                    : 'Ready to accept new deliveries'
                : 'Toggle availability to start accepting orders'}
            </p>

            {stats.active_deliveries > 0 && (
              <Link to="/driver/active-order"
                className="font-switzer inline-flex items-center gap-2 text-[#f2fd7d] text-sm font-semibold hover:gap-3 transition-all">
                View active delivery <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
          style={{
            background: isAvailable ? 'rgba(74,222,128,0.04)' : '#080808',
            border: `1px solid ${isAvailable ? 'rgba(74,222,128,0.2)' : '#1a1a1a'}`,
          }}>

          {isAvailable && (
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)' }} />
          )}

          <div className="flex flex-col h-full justify-between min-h-[160px]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-switzer text-[#444] text-xs uppercase tracking-wider mb-2">Status</p>
                <p className={`font-technor font-black text-2xl ${isAvailable ? 'text-green-400' : 'text-[#333]'}`}>
                  {isAvailable ? 'ONLINE' : 'OFFLINE'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all`}
                style={{ background: isAvailable ? 'rgba(74,222,128,0.1)' : '#111' }}>
                <Power size={20} className={isAvailable ? 'text-green-400' : 'text-[#333]'} />
              </div>
            </div>

            <button onClick={handleToggleAvailability} disabled={updatingAvailability}
              className="font-switzer w-full h-11 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: isAvailable ? 'rgba(239,68,68,0.08)' : '#f2fd7d',
                border: isAvailable ? '1px solid rgba(239,68,68,0.2)' : 'none',
                color: isAvailable ? '#f87171' : '#000',
              }}>
              {updatingAvailability
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Updating...</>
                : isAvailable ? 'Go Offline' : 'Go Online'
              }
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Deliveries', value: stats.total_deliveries, icon: Package, accent: '#f2fd7d', sub: 'Total completed' },
          { label: 'Fuel Delivered', value: `${Number(stats.total_liters_delivered).toLocaleString()}L`, icon: Droplets, accent: '#f2fd7d', sub: 'All time' },
          { label: 'Distance', value: `${Number(stats.total_distance).toFixed(1)}km`, icon: Navigation, accent: '#60a5fa', sub: 'Total covered' },
          { label: 'Rating', value: stats.average_rating > 0 ? stats.average_rating.toFixed(1) : '—', icon: Star, accent: stats.average_rating >= 4.5 ? '#4ade80' : '#f2fd7d', sub: stats.average_rating >= 4.5 ? 'Excellent' : 'Keep it up' },
        ].map(({ label, value, icon: Icon, accent, sub }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-300 group"
            style={{ background: '#080808', border: '1px solid #1a1a1a' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = accent + '35'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}>
            <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `radial-gradient(circle at 100% 0%, ${accent}12, transparent 70%)` }} />
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
              style={{ background: accent + '15' }}>
              <Icon className="w-4 h-4" style={{ color: accent }} />
            </div>
            <p className="font-switzer text-[#444] text-xs mb-1">{label}</p>
            <p className="font-technor font-bold text-xl sm:text-2xl text-white">{value}</p>
            <p className="font-switzer text-[#2a2a2a] text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/driver/available-orders"
          className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
          style={{ background: '#080808', border: '1px solid #1a1a1a' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(242,253,125,0.25)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'radial-gradient(circle at 0% 100%, rgba(242,253,125,0.04), transparent 70%)' }} />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: 'rgba(242,253,125,0.1)' }}>
                <Package size={22} className="text-[#f2fd7d]" />
              </div>
              <div>
                <h3 className="font-satoshi font-bold text-white mb-1">Available Orders</h3>
                <p className="font-switzer text-[#444] text-sm">
                  {stats.available_orders > 0
                    ? `${stats.available_orders} ${stats.available_orders === 1 ? 'order' : 'orders'} waiting`
                    : 'No orders right now'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {stats.available_orders > 0 && (
                <span className="font-technor bg-[#f2fd7d] text-black text-xs font-black px-2.5 py-1 rounded-full">
                  {stats.available_orders}
                </span>
              )}
              <ArrowRight size={18} className="text-[#2a2a2a] group-hover:text-[#f2fd7d] transition-colors" />
            </div>
          </div>
        </Link>

        <Link to="/driver/active-order"
          className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
          style={{ background: '#080808', border: '1px solid #1a1a1a' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(96,165,250,0.25)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'radial-gradient(circle at 0% 100%, rgba(96,165,250,0.04), transparent 70%)' }} />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: 'rgba(96,165,250,0.1)' }}>
                <Zap size={22} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-satoshi font-bold text-white mb-1">Active Delivery</h3>
                <p className="font-switzer text-[#444] text-sm">
                  {stats.active_deliveries > 0
                    ? `${stats.active_deliveries} in progress`
                    : 'No active deliveries'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {stats.active_deliveries > 0 && (
                <span className="font-technor bg-blue-500 text-white text-xs font-black px-2.5 py-1 rounded-full animate-pulse">
                  {stats.active_deliveries}
                </span>
              )}
              <ArrowRight size={18} className="text-[#2a2a2a] group-hover:text-blue-400 transition-colors" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Deliveries */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #111' }}>
          <div>
            <h2 className="font-satoshi font-bold text-white text-lg">Recent Deliveries</h2>
            <p className="font-switzer text-[#444] text-xs mt-0.5">Your latest completed orders</p>
          </div>
          <Link to="/driver/history"
            className="font-switzer text-[#f2fd7d] text-sm font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {recentDeliveries.length > 0 ? recentDeliveries.map((delivery, i) => (
          <div key={delivery.id}>
            <div className="flex items-center justify-between px-6 py-4 transition-colors cursor-default"
              onMouseEnter={e => e.currentTarget.style.background = '#0d0d0d'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: '#111', border: '1px solid #1a1a1a' }}>
                  <Fuel size={16} className="text-[#333]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-satoshi font-bold text-white text-sm">
                      {delivery.order_number || `Order #${delivery.id}`}
                    </p>
                    {delivery.customer_rating && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(242,253,125,0.08)', border: '1px solid rgba(242,253,125,0.15)' }}>
                        <Star size={10} className="text-[#f2fd7d] fill-[#f2fd7d]" />
                        <span className="font-technor text-[#f2fd7d] text-xs">{delivery.customer_rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 font-switzer text-xs text-[#444]">
                    <span className="flex items-center gap-1"><MapPin size={11} />{delivery.distance_km || '0'} km</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {delivery.completed_at ? new Date(delivery.completed_at).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="font-technor font-bold text-[#f2fd7d]">
                ₦{Number(delivery.delivery_fee || delivery.total_price || 0).toLocaleString()}
              </p>
            </div>
            {i < recentDeliveries.length - 1 && (
              <div className="mx-6" style={{ borderTop: '1px solid #0d0d0d' }} />
            )}
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
              <Package size={22} className="text-[#2a2a2a]" />
            </div>
            <div className="text-center">
              <p className="font-satoshi text-white text-sm font-semibold mb-1">No deliveries yet</p>
              <p className="font-switzer text-[#444] text-xs">Accept orders to see your history</p>
            </div>
            <Link to="/driver/available-orders"
              className="font-switzer bg-[#f2fd7d] text-black px-6 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
              View Available Orders
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}