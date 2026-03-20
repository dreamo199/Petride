import { Link } from 'react-router';
import { Plus, TrendingUp, Package, DollarSign, CheckCircle, ArrowRight, Droplets, Clock, MapPin, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/order';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import OrdersTable from '../../components/OrdersTable';

const statusColors = {
  'Completed': 'bg-green-500/20 text-green-400 border-green-500/30',
  'In Transit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
};

function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    completed_orders: 0,
    total_spent: 0,
    total_liters_ordered: 0,
    currency: '₦',
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [analyticsData, ordersData] = await Promise.all([
        orderService.getAnalytics(),
        orderService.getOrders(),
      ]);

      setStats({
        total_orders: analyticsData.overview.total_orders,
        total_spent: analyticsData.financial.total_spent,
        total_liters_ordered: analyticsData.fuel.total_liters_ordered,
        completed_orders: analyticsData.overview.completed_order,
        currency: analyticsData.financial.currency,
      });
      setOrders(ordersData.results?.slice(0, 5) || ordersData.slice(0, 5));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#b2beb5]">Please login to view this page</p>
      </div>
    );
  }

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

  const activeOrder = orders.find(
    (o) => o.status_display === 'In Transit' || o.status_display === 'Assigned' || o.status_display === 'Pending'
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top row: Welcome + Quick Order */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Welcome Card */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#141414] border border-[#343434] rounded-2xl p-8">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#f2fd7d]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-8 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h1 className="font-['Inter',sans-serif] font-bold text-3xl text-[#fcfcfc] mb-3">
              {getGreeting()}, {user?.user?.first_name || user?.user?.username} 👋
            </h1>
            <p className="font-['Manrope',sans-serif] text-[#888] text-sm max-w-md">
              {activeOrder
                ? `You have an active order — ${activeOrder.order_number}`
                : "You're all caught up. Place a new order whenever you're ready."}
            </p>
            {activeOrder && (
              <Link
                to={activeOrder.status_display === 'In Transit' ?  `/customer/orders/${activeOrder.id}` : ''}
                className="inline-flex items-center gap-2 mt-4 text-[#f2fd7d] text-sm font-medium hover:gap-3 transition-all"
              >
                View Order <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Quick Order Card */}
        <Link
          to="/customer/new-order"
          className="group relative overflow-hidden bg-gradient-to-br from-[#f2fd7d] to-[#e8f171] rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#f2fd7d]/20 hover:scale-[1.02]"
        >
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={24} className="text-black" />
            </div>
            <div className="flex-1">
              <h2 className="font-['Inter',sans-serif] font-bold text-xl text-black mb-2">
                New Order
              </h2>
              <p className="text-black/60 text-sm">
                Fuel delivered to your doorstep
              </p>
            </div>
            <div className="flex items-center gap-2 text-black font-semibold text-sm mt-4 group-hover:gap-3 transition-all">
              Place Order <ArrowRight size={16} />
            </div>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-[#f2fd7d]" />
            </div>
            <span className="text-xs text-green-400 font-medium">+12%</span>
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Total Orders</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.total_orders}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#f2fd7d]" />
            </div>
            <span className="text-xs text-green-400 font-medium">+8%</span>
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Total Spent</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.currency} {Number(stats.total_spent).toLocaleString()}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-[#f2fd7d]" />
            </div>
            <span className="text-xs text-green-400 font-medium">+15%</span>
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Fuel Ordered</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.total_liters_ordered}L
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#f2fd7d]" />
            </div>
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Completed</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.completed_orders}
          </p>
        </div>
      </div>

      {/* Active Order Banner */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30 rounded-2xl p-5 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Clock size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[#fcfcfc] font-semibold mb-1">{activeOrder.order_number}</p>
                <p className="text-[#b2beb5] text-sm flex items-center gap-2 flex-wrap">
                  <span>{activeOrder.fuel_type_name}</span>
                  <span>•</span>
                  <span>{activeOrder.quantity_liters}L</span>
                  <span>•</span>
                  <span>{stats.currency} {Number(activeOrder.total_price).toLocaleString()}</span>
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[activeOrder.status_display]}`}>
                {activeOrder.status_display}
              </span>
            </div>
            <Link
              to={activeOrder.status_display === 'In Transit' ? `/customer/tracking/${activeOrder.id}` : `/customer/orders/${activeOrder.id}`}
              className="text-[#f2fd7d] font-medium flex items-center gap-2 hover:gap-3 transition-all"
            >
              {activeOrder.status_display === 'In Transit' ? 'Track Order' : 'View Details'}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <OrdersTable orders={orders} />
    </div>
  );
}

export default CustomerDashboard;