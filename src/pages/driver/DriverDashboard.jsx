import { Link } from 'react-router-dom';
import { TrendingUp, Package, Droplets, Star, Power, MapPin, Clock, Fuel, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { driverService } from '../../services/driver';
import { orderService } from '../../services/order';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_deliveries: 0,
    total_liters_delivered: 0,
    total_distance: 0,
    average_rating: 0,
    available_orders: 0,
    active_deliveries: 0,
    currency: '₦',
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await driverService.getDriverProfile();
      setIsAvailable(profile.is_available);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      toast.error('Failed to load user profile');
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardData, orderData, recentOrder] = await Promise.all([
        driverService.getAnalytics(),
        driverService.availableOrders(),
        orderService.getOrders()
      ]);

      setStats({
        total_deliveries: dashboardData.overview?.total_deliveries || 0,
        total_liters_delivered: dashboardData.performance?.total_liters_delivered || 0,
        total_distance: dashboardData.performance?.total_distance_km || 0,
        average_rating: dashboardData.ratings?.current_rating || 0,
        available_orders: orderData?.length || 0,
        active_deliveries: dashboardData.overview?.active_deliveries || 0,
        currency: dashboardData.currency || '₦',
      });

      if (recentOrder?.results) {
        setRecentDeliveries(recentOrder.results.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (updatingAvailability) return;

    const newStatus = !isAvailable;
    try {
      setUpdatingAvailability(true);
      await driverService.updateAvailability();
      setIsAvailable(newStatus);
      toast.success(
        newStatus ? '✓ You are now available for orders' : 'You are now offline',
        { duration: 3000 }
      );
    } catch (error) {
      console.error('Failed to update availability:', error);
      toast.error('Failed to update availability. Please try again.');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
          <p className="text-[#b2beb5]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Top row: Welcome + Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Welcome Card */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#141414] border border-[#343434] rounded-2xl p-8">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-8 w-40 h-40 bg-[#f2fd7d]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className={`text-xs font-medium ${isAvailable ? 'text-green-400' : 'text-[#888]'}`}>
                {isAvailable ? 'Online & Available' : 'Offline'}
              </span>
            </div>

            <h2 className="font-['Inter',sans-serif] font-bold text-2xl text-[#a09797] mb-1">
            {getGreeting()}, {user?.user?.first_name || user?.user?.username || 'Driver'}
            </h2>
    
            <p className="font-['Manrope',sans-serif] text-[#888] text-sm max-w-md">
              {isAvailable
                ? stats.active_deliveries > 0
                  ? `You have ${stats.active_deliveries} active ${stats.active_deliveries === 1 ? 'delivery' : 'deliveries'} in progress`
                  : stats.available_orders > 0
                    ? `${stats.available_orders} ${stats.available_orders === 1 ? 'order is' : 'orders are'} waiting for you`
                    : 'Ready to accept new deliveries'
                : 'Toggle availability to start accepting orders'}
            </p>

            {stats.active_deliveries > 0 && (
              <Link
                to="/driver/active-order"
                className="inline-flex items-center gap-2 mt-4 text-[#f2fd7d] text-sm font-medium hover:gap-3 transition-all"
              >
                View Active Delivery <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Availability Toggle Card */}
        <div
          className={`
            relative overflow-hidden rounded-2xl p-6
            transition-all duration-300
            ${isAvailable
              ? 'bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30'
              : 'bg-[#0a0a0a] border-[#343434]'
            }
            border hover:shadow-lg
          `}
        >
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[#b2beb5] text-xs font-medium mb-2">Availability Status</p>
                <p className={`font-bold text-xl ${isAvailable ? 'text-green-400' : 'text-[#888]'}`}>
                  {isAvailable ? 'Online' : 'Offline'}
                </p>
              </div>
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${isAvailable ? 'bg-green-500/20' : 'bg-[#141414]'}
                  transition-all duration-300
                `}
              >
                <Power size={20} className={isAvailable ? 'text-green-400' : 'text-[#555]'} />
              </div>
            </div>

            <button
              onClick={handleToggleAvailability}
              disabled={updatingAvailability}
              className={`
                w-full h-12 rounded-xl font-semibold text-sm
                transition-all duration-200
                ${isAvailable
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                  : 'bg-[#f2fd7d] text-black hover:opacity-90'
                }
                ${updatingAvailability ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {updatingAvailability ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Updating...
                </span>
              ) : isAvailable ? (
                'Go Offline'
              ) : (
                'Go Online'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-[#f2fd7d]" />
            </div>
            {stats.total_deliveries > 0 && (
              <span className="text-xs text-green-400 font-medium">+{stats.total_deliveries}</span>
            )}
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Total Deliveries</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.total_deliveries}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-[#f2fd7d]" />
            </div>
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Liters Delivered</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.total_liters_delivered}L
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#f2fd7d]" />
            </div>
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Total Distance</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.total_distance}km
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-[#f2fd7d]" />
            </div>
            {stats.average_rating >= 4.5 && (
              <span className="text-xs text-green-400 font-medium">Excellent</span>
            )}
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Average Rating</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.average_rating > 0 ? stats.average_rating.toFixed(1) : '0.0'}
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Available Orders */}
        <Link
          to="/driver/available-orders"
          className="group relative overflow-hidden bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6 hover:border-[#f2fd7d]/50 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#f2fd7d]/0 to-[#f2fd7d]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#f2fd7d]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package size={24} className="text-[#f2fd7d]" />
              </div>
              <div>
                <h3 className="text-[#fcfcfc] font-bold text-lg mb-1">Available Orders</h3>
                <p className="text-[#b2beb5] text-sm">
                  {stats.available_orders > 0
                    ? `${stats.available_orders} ${stats.available_orders === 1 ? 'order' : 'orders'} waiting`
                    : 'No orders available right now'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {stats.available_orders > 0 && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full animate-pulse">
                  {stats.available_orders}
                </span>
              )}
              <ArrowRight size={20} className="text-[#343434] group-hover:text-[#f2fd7d] transition-colors" />
            </div>
          </div>
        </Link>

        {/* Active Delivery */}
        <Link
          to="/driver/active-order"
          className="group relative overflow-hidden bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap size={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-[#fcfcfc] font-bold text-lg mb-1">Active Delivery</h3>
                <p className="text-[#b2beb5] text-sm">
                  {stats.active_deliveries > 0
                    ? `${stats.active_deliveries} ${stats.active_deliveries === 1 ? 'delivery' : 'deliveries'} in progress`
                    : 'No active deliveries'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {stats.active_deliveries > 0 && (
                <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1.5 rounded-full animate-pulse">
                  {stats.active_deliveries}
                </span>
              )}
              <ArrowRight size={20} className="text-[#343434] group-hover:text-blue-400 transition-colors" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Deliveries */}
      <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h2 className="text-[#fcfcfc] font-semibold text-xl">Recent Deliveries</h2>
            <p className="text-[#b2beb5] text-sm mt-1">Your latest completed orders</p>
          </div>
          <Link
            to="/driver/history"
            className="text-[#f2fd7d] text-sm font-medium flex items-center gap-2 hover:gap-3 transition-all"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="border-t border-[#343434]" />

        {recentDeliveries.length > 0 ? (
          <div>
            {recentDeliveries.map((delivery, i) => (
              <div key={delivery.id}>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-[#141414] transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-[#141414] border border-[#343434] flex items-center justify-center">
                      <Fuel size={18} className="text-[#888]" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-[#fcfcfc] font-semibold">
                          {delivery.order_number || `Order #${delivery.id}`}
                        </p>
                        {delivery.customer_rating && (
                          <div className="flex items-center gap-1 bg-[#f2fd7d]/10 px-2 py-1 rounded-full border border-[#f2fd7d]/30">
                            <Star size={12} className="text-[#f2fd7d] fill-[#f2fd7d]" />
                            <span className="text-[#f2fd7d] text-xs font-semibold">
                              {delivery.customer_rating}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-[#b2beb5]">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {delivery.distance_km || '0'} km
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} />
                          {delivery.completed_at ? new Date(delivery.completed_at).toLocaleDateString() : 'Today'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[#f2fd7d] font-bold text-lg">
                    {stats.currency}{delivery.total_price?.toLocaleString() || '0'}
                  </p>
                </div>

                {i < recentDeliveries.length - 1 && <div className="mx-6 border-t border-[#343434]" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-xl bg-[#141414] border border-[#343434] flex items-center justify-center">
              <Package size={24} className="text-[#555]" />
            </div>
            <p className="text-[#fcfcfc] font-medium">No deliveries yet</p>
            <p className="text-[#b2beb5] text-sm">Start accepting orders to see your history</p>
            <Link
              to="/driver/available-orders"
              className="mt-2 bg-[#f2fd7d] text-black px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              View Available Orders
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}