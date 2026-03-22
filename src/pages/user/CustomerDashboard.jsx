import { Link } from 'react-router';
import { Plus, Package, DollarSign, CheckCircle, ArrowRight, Droplets, Clock, RefreshCw, Zap } from 'lucide-react';
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
    total_orders: 0, pending_orders: 0, completed_orders: 0,
    total_spent: 0, total_liters_ordered: 0, currency: '₦',
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const [analyticsData, ordersData] = await Promise.all([
        orderService.getAnalytics(), orderService.getOrders(),
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
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-switzer text-[#b2beb5]">Please login to view this page</p>
    </div>
  );

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
        <p className="font-switzer text-[#b2beb5]">Loading dashboard...</p>
      </div>
    </div>
  );

  const activeOrder = orders.find(o =>
    o.status_display === 'In Transit' || o.status_display === 'Assigned' || o.status_display === 'Pending'
  );

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completionRate = stats.total_orders > 0
    ? Math.round((stats.completed_orders / stats.total_orders) * 100)
    : 0;

  return (
    <div className="p-4 sm:p-6 space-y-5 overflow-x-hidden pb-24 lg:pb-6">

      {/* Hero Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Welcome Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl p-7 sm:p-8"
          style={{ background: '#080808', border: '1px solid #1a1a1a' }}>

          {/* Background dot grid */}
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: 'radial-gradient(circle, #222 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

          {/* Accent glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(242,253,125,0.08) 0%, transparent 70%)' }} />

          {/* Top border glow */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(242,253,125,0.3), transparent)' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f2fd7d] animate-pulse" />
              <span className="font-switzer text-[#f2fd7d] text-xs tracking-widest uppercase font-semibold">
                {getGreeting()}
              </span>
            </div>

            <h1 className="font-technor font-black text-3xl sm:text-4xl text-white mb-3 leading-tight">
              {user?.user?.first_name || user?.user?.username}
            </h1>

            <h3 className="font-switzer text-[#555] font-semibold text-lg max-w-md mb-1">
              ID: {user?.customer_id}
            </h3>

            <p className="font-switzer text-[#555] text-sm max-w-md mb-5">
              {activeOrder
                ? `Active order in progress — ${activeOrder.order_number}`
                : "You're all caught up. Ready to place a new order?"}
            </p>

            {activeOrder ? (
              <Link
                to={activeOrder.status_display === 'In Transit' ? `/customer/orders/${activeOrder.id}` : ''}
                className="inline-flex items-center gap-2 font-switzer text-[#f2fd7d] text-sm font-medium hover:gap-3 transition-all"
              >
                View active order <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                to="/customer/new-order"
                className="inline-flex items-center gap-2 font-switzer bg-[#f2fd7d] text-black text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
              >
                <Plus size={16} /> Place order
              </Link>
            )}
          </div>
        </div>

        {/* Quick Order Card */}
        <Link to="/customer/new-order"
          className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
          style={{ background: '#f2fd7d', border: '1px solid #e8f171' }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }} />
          <div className="absolute bottom-0 right-0 w-32 h-32"
            style={{ background: 'radial-gradient(circle at 100% 100%, rgba(0,0,0,0.1), transparent 70%)' }} />

          <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
            <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap size={22} className="text-black" />
            </div>
            <div>
              <h2 className="font-technor font-black text-2xl text-black mb-1">New Order</h2>
              <p className="font-switzer text-black/60 text-sm mb-4">Fuel delivered to your doorstep</p>
              <div className="flex items-center gap-2 font-switzer text-black font-bold text-sm group-hover:gap-3 transition-all">
                Place Order <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Orders', value: stats.total_orders, icon: Package, sub: 'All time', accent: '#f2fd7d' },
          { label: 'Total Spent', value: `${stats.currency}${Number(stats.total_spent).toLocaleString()}`, icon: DollarSign, sub: 'Lifetime spend', accent: '#f2fd7d' },
          { label: 'Fuel Ordered', value: `${Number(stats.total_liters_ordered).toLocaleString()}L`, icon: Droplets, sub: 'Liters delivered', accent: '#f2fd7d' },
          { label: 'Completed', value: `${completionRate}%`, icon: CheckCircle, sub: `${stats.completed_orders} orders done`, accent: completionRate >= 80 ? '#4ade80' : '#f2fd7d' },
        ].map(({ label, value, icon: Icon, sub, accent }) => (
          <div key={label}
            className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-300 group"
            style={{ background: '#080808', border: '1px solid #1a1a1a' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = accent + '40'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
          >
            <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `radial-gradient(circle at 100% 0%, ${accent}10, transparent 70%)` }} />

            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
              style={{ background: accent + '15' }}>
              <Icon className="w-4 h-4" style={{ color: accent }} />
            </div>
            <p className="font-switzer text-[#555] text-xs mb-1">{label}</p>
            <p className="font-technor font-bold text-xl sm:text-2xl text-white">{value}</p>
            <p className="font-switzer text-[#333] text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Active Order Banner */}
      {activeOrder && (
        <div className="relative overflow-hidden rounded-2xl p-5"
          style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-blue-500" />
          <div className="flex items-center justify-between flex-wrap gap-4 pl-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-satoshi font-bold text-white text-sm">{activeOrder.order_number}</p>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-switzer font-medium border ${statusColors[activeOrder.status_display]}`}>
                    {activeOrder.status_display}
                  </span>
                </div>
                <p className="font-switzer text-[#555] text-xs flex items-center gap-2">
                  <span>{activeOrder.fuel_type_name}</span>
                  <span className="text-[#333]">·</span>
                  <span>{activeOrder.quantity_liters}L</span>
                  <span className="text-[#333]">·</span>
                  <span>{stats.currency}{Number(activeOrder.total_price).toLocaleString()}</span>
                </p>
              </div>
            </div>
            <Link
              to={activeOrder.status_display === 'In Transit' ? `/customer/tracking/${activeOrder.id}` : `/customer/orders/${activeOrder.id}`}
              className="font-switzer text-blue-400 font-medium text-sm flex items-center gap-2 hover:gap-3 transition-all"
            >
              {activeOrder.status_display === 'In Transit' ? 'Track Order' : 'View Details'}
              <ArrowRight size={14} />
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