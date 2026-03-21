import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Droplets, Clock, Fuel, ArrowUpRight, RefreshCw, Package, XCircle, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { orderService } from '../../services/order';
import { toast } from 'sonner';

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0a0a] border border-[#343434] rounded-xl px-4 py-3 shadow-xl">
      <p className="font-switzer text-[#b2beb5] text-xs mb-1">{label}</p>
      <p className="font-switzer text-white font-semibold text-sm">
        {prefix}{Number(payload[0].value).toLocaleString()}{suffix}
      </p>
    </div>
  );
};

function CustomerAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total_orders: 0,
    completed_orders: 0,
    cancelled_orders: 0,
    pending_orders: 0,
    total_spent: 0,
    total_liters_ordered: 0,
    currency: '₦',
    average_order: 0,
    orders_last_7_days: 0,
    spent_last_7_days: 0,
    favourite_fuel: 'N/A',
    total_ratings: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const d = await orderService.getAnalytics();

      setStats({
        total_orders: d.overview.total_orders,
        completed_orders: d.overview.completed_order,
        cancelled_orders: d.overview.cancelled_orders,
        pending_orders: d.overview.pending_orders,
        total_spent: Number(d.financial.total_spent),
        total_liters_ordered: Number(d.fuel.total_liters_ordered),
        currency: d.financial.currency,
        average_order: Number(d.financial.average_spent),
        spent_last_7_days: Number(d.recent_activity.spent_last_7_days),
        orders_last_7_days: d.recent_activity.orders_last_7_days,
        favourite_fuel: d.fuel.favourite_fuel || 'N/A',
        total_ratings: d.ratings?.total_ratings || 0,
      });

      if (d.monthly_breakdown?.length > 0) {
        setMonthlyData(d.monthly_breakdown.map(item => ({
          month: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
          amount: item.spent || 0,
          orders: item.orders || 0,
          liters: item.liters || 0,
        })));
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
    toast.success('Analytics refreshed');
  };

  const completionRate = stats.total_orders > 0
    ? Math.round((stats.completed_orders / stats.total_orders) * 100)
    : 0;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
          <p className="font-switzer text-[#b2beb5]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 pb-24 lg:pb-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-technor font-bold text-2xl sm:text-3xl text-[#fcfcfc] mb-1">
            Analytics
          </h1>
          <p className="font-switzer text-[#b2beb5]">
            Your fuel consumption and spending overview
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="border border-[#343434] text-[#fcfcfc] hover:bg-[#141414] rounded-lg px-4 py-2 text-sm font-medium transition-all inline-flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Orders',
            value: stats.total_orders,
            icon: Package,
            sub: `${stats.orders_last_7_days} this week`,
            color: '#f2fd7d',
          },
          {
            label: 'Total Spent',
            value: `${stats.currency}${stats.total_spent.toLocaleString()}`,
            icon: DollarSign,
            sub: `${stats.currency}${stats.spent_last_7_days.toLocaleString()} this week`,
            color: '#f2fd7d',
          },
          {
            label: 'Total Fuel',
            value: `${stats.total_liters_ordered.toLocaleString()}L`,
            icon: Droplets,
            sub: `Avg ${stats.average_order > 0 ? `${stats.currency}${stats.average_order.toLocaleString()}` : '—'} / order`,
            color: '#f2fd7d',
          },
          {
            label: 'Completion Rate',
            value: `${completionRate}%`,
            icon: CheckCircle,
            sub: `${stats.completed_orders} completed`,
            color: completionRate >= 80 ? '#4ade80' : '#f2fd7d',
          },
        ].map(({ label, value, icon: Icon, sub, color }) => (
          <div key={label} className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-3 sm:p-5 hover:border-[#f2fd7d]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="flex items-center gap-1 text-xs text-green-400">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="font-switzer text-[#b2beb5] text-xs mb-1">{label}</p>
            <p className="font-technor font-bold text-xl sm:text-2xl text-[#fcfcfc]">{value}</p>
            <p className="font-switzer text-[#555] text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-4 sm:p-5 text-center hover:border-green-500/30 transition-all">
          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="font-technor font-bold text-2xl text-green-400">{stats.completed_orders}</p>
          <p className="font-switzer text-[#b2beb5] text-xs mt-1">Completed</p>
        </div>
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-4 sm:p-5 text-center hover:border-yellow-500/30 transition-all">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="font-technor font-bold text-2xl text-yellow-400">{stats.pending_orders}</p>
          <p className="font-switzer text-[#b2beb5] text-xs mt-1">Pending</p>
        </div>
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-4 sm:p-5 text-center hover:border-red-500/30 transition-all">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="font-technor font-bold text-2xl text-red-400">{stats.cancelled_orders}</p>
          <p className="font-switzer text-[#b2beb5] text-xs mt-1">Cancelled</p>
        </div>
      </div>

      {/* Spending Chart + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#343434] rounded-2xl p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="font-satoshi font-semibold text-lg text-[#fcfcfc]">Spending Trend</h2>
              <p className="font-switzer text-[#b2beb5] text-sm mt-1">Monthly fuel expenditure</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyData.length > 0 ? monthlyData : [{ month: 'Now', amount: stats.total_spent }]}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f2fd7d" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f2fd7d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#343434" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#b2beb5', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#b2beb5', fontSize: 12 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip prefix="₦" />} />
              <Area type="monotone" dataKey="amount" stroke="#f2fd7d" strokeWidth={3} fill="url(#spendGrad)" dot={false} activeDot={{ r: 5, fill: '#f2fd7d', stroke: '#0a0a0a', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Real Insight Cards */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 flex items-start gap-4 hover:border-[#f2fd7d]/30 transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#f2fd7d]/10">
              <Fuel size={20} className="text-[#f2fd7d]" />
            </div>
            <div className="min-w-0">
              <p className="font-switzer text-[#b2beb5] text-xs mb-1">Favourite Fuel</p>
              <p className="font-technor font-bold text-xl text-[#fcfcfc] capitalize">{stats.favourite_fuel}</p>
              <p className="font-switzer text-[#555] text-xs mt-1">Most ordered type</p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 flex items-start gap-4 hover:border-[#f2fd7d]/30 transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/10">
              <TrendingUp size={20} className="text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="font-switzer text-[#b2beb5] text-xs mb-1">Avg Order Value</p>
              <p className="font-technor font-bold text-xl text-[#fcfcfc]">
                {stats.currency}{stats.average_order.toLocaleString()}
              </p>
              <p className="font-switzer text-[#555] text-xs mt-1">Per delivery</p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 flex items-start gap-4 hover:border-[#f2fd7d]/30 transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-green-500/10">
              <CheckCircle size={20} className="text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="font-switzer text-[#b2beb5] text-xs mb-1">Ratings Given</p>
              <p className="font-technor font-bold text-xl text-[#fcfcfc]">{stats.total_ratings}</p>
              <p className="font-switzer text-[#555] text-xs mt-1">Orders reviewed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Activity Bar Chart */}
      <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="font-satoshi font-semibold text-lg text-[#fcfcfc]">Orders Activity</h2>
          <p className="font-switzer text-[#b2beb5] text-sm mt-1">Monthly order count over the last 6 months</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData.length > 0 ? monthlyData : [{ month: 'Now', orders: stats.total_orders }]} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#343434" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#b2beb5', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#b2beb5', fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip suffix=" orders" />} />
            <Bar dataKey="orders" fill="#f2fd7d" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity Summary */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#f2fd7d]/10 to-transparent border border-[#f2fd7d]/20 rounded-2xl p-5">
          <p className="font-switzer text-[#b2beb5] text-xs mb-2">Spent This Week</p>
          <p className="font-technor font-bold text-3xl text-[#f2fd7d]">
            {stats.currency}{stats.spent_last_7_days.toLocaleString()}
          </p>
          <p className="font-switzer text-[#555] text-xs mt-2">Last 7 days activity</p>
        </div>
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5">
          <p className="font-switzer text-[#b2beb5] text-xs mb-2">Orders This Week</p>
          <p className="font-technor font-bold text-3xl text-[#fcfcfc]">{stats.orders_last_7_days}</p>
          <p className="font-switzer text-[#555] text-xs mt-2">Last 7 days activity</p>
        </div>
      </div>

    </div>
  );
}

export default CustomerAnalyticsPage;