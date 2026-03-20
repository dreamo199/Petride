import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Droplets, Clock, Fuel, ArrowUpRight, RefreshCw } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { orderService } from '../../services/order';
import { toast } from 'sonner';

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0a0a] border border-[#343434] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-[#b2beb5] text-xs mb-1">{label}</p>
      <p className="text-white font-semibold text-sm">
        {prefix}{Number(payload[0].value).toLocaleString()}{suffix}
      </p>
    </div>
  );
};

const periods = ['7D', '1M', '6M', '1Y'];

function PeriodToggle({ active, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-[#0a0a0a] border border-[#343434] rounded-lg p-1">
      {periods.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
            active === p
              ? 'bg-[#f2fd7d] text-black shadow-sm'
              : 'text-[#b2beb5] hover:text-[#fcfcfc] hover:bg-[#141414]'
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

function CustomerAnalyticsPage() {
  const [spendingPeriod, setSpendingPeriod] = useState('7D');
  const [ordersPeriod, setOrdersPeriod] = useState('7D');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    pending_orders: 0,
    completed_orders: 0,
    total_spent: 0,
    total_liters_ordered: 0,
    currency: '₦',
    average_order: 0,
    orders_last_7_days: 0,
    spent_last_7_days: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const analyticsData = await orderService.getAnalytics();

      setStats({
        total_orders: analyticsData.overview.total_orders,
        total_spent: analyticsData.financial.total_spent,
        total_liters_ordered: analyticsData.fuel.total_liters_ordered,
        completed_orders: analyticsData.overview.completed_order,
        currency: analyticsData.financial.currency,
        average_order: analyticsData.financial.average_spent,
        spent_last_7_days: analyticsData.recent_activity.spent_last_7_days,
        orders_last_7_days: analyticsData.recent_activity.orders_last_7_days,
        favourite_fuel: analyticsData.fuel.favourite_fuel || 'N/A',
      });
      console.log(analyticsData);

      if (analyticsData.monthly_breakdown && analyticsData.monthly_breakdown.length > 0) {
        const formattedMonthly = analyticsData.monthly_breakdown.map(item => ({
          month: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
          amount: item.spent || 0,
          orders: item.orders || 0,
          liters: item.liters || 0,
        }));
        setMonthlyData(formattedMonthly);
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

  const spendingData = monthlyData.length > 0 ? monthlyData : [
    { month: 'Feb', amount: stats.total_spent }
  ];

  const monthlyOrdersData = monthlyData.length > 0 ? monthlyData : [
    { month: 'Feb', orders: stats.total_orders }
  ];

  const fuelTypeData = [
    { name: stats.favourite_fuel, fill: '#f2fd7d' },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
          <p className="text-[#b2beb5]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-['Inter',sans-serif] font-bold text-3xl text-[#fcfcfc] mb-2">
            Analytics Dashboard
          </h1>
          <p className="font-['Manrope',sans-serif] text-[#b2beb5]">
            Track your fuel consumption and spending patterns
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#f2fd7d]" />
            </div>
            <span className="flex items-center gap-1 text-xs text-green-400">
              <ArrowUpRight className="w-3 h-3" />
              +18%
            </span>
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Completed Orders</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.completed_orders}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#f2fd7d]" />
            </div>
            <span className="flex items-center gap-1 text-xs text-green-400">
              <ArrowUpRight className="w-3 h-3" />
              +12%
            </span>
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Total Spent</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.currency} {stats.total_spent.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-[#f2fd7d]" />
            </div>
            <span className="flex items-center gap-1 text-xs text-green-400">
              <ArrowUpRight className="w-3 h-3" />
              +15%
            </span>
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Total Fuel</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.total_liters_ordered}L
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#f2fd7d]" />
            </div>
            <span className="flex items-center gap-1 text-xs text-green-400">
              <ArrowUpRight className="w-3 h-3" />
              +5%
            </span>
          </div>
          <p className="text-[#b2beb5] text-xs mb-2">Avg Order</p>
          <p className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            {stats.currency} {stats.average_order.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts row: Spending + Pie */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Spending Chart */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#fcfcfc] font-semibold text-lg">Spending Trend</h2>
              <p className="text-[#b2beb5] text-sm mt-1">Monthly fuel expenditure</p>
            </div>
            <PeriodToggle active={spendingPeriod} onChange={setSpendingPeriod} />
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={spendingData}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f2fd7d" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f2fd7d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#343434" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#b2beb5', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#b2beb5', fontSize: 12 }}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip prefix="₦" />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#f2fd7d"
                strokeWidth={3}
                fill="url(#spendGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#f2fd7d', stroke: '#0a0a0a', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Insight Cards */}
        <div className="flex flex-col gap-4">
          {[
            { label: 'Favorite Fuel', value: stats.favourite_fuel || 'N/A', icon: Fuel, color: '#f2fd7d' },
            { label: 'Most Active Day', value: 'Saturday', sub: '8 orders placed', icon: TrendingUp, color: '#3b82f6' },
            { label: 'Time Saved', value: '~24 hrs', sub: 'vs. visiting stations', icon: Clock, color: '#10b981' },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 flex-1 flex items-start gap-4 hover:border-[#f2fd7d]/30 transition-all">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}15` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="text-[#b2beb5] text-xs mb-1">{label}</p>
                <p className="text-[#fcfcfc] font-bold text-xl leading-tight">{value}</p>
                <p className="text-[#b2beb5] text-xs mt-1">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pie Chart */}
        {/* <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-[#fcfcfc] font-semibold text-lg">Fuel Breakdown</h2>
            <p className="text-[#b2beb5] text-sm mt-1">By type ordered</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={fuelTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {fuelTypeData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip suffix="%" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
         {/* <div className="flex flex-col gap-3 mt-4">
            {fuelTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ background: item.fill }} />
                  <span className="text-[#b2beb5] text-sm">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Orders Bar Chart + Insights */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#fcfcfc] font-semibold text-lg">Orders Activity</h2>
              <p className="text-[#b2beb5] text-sm mt-1">Number of orders placed</p>
            </div>
            <PeriodToggle active={ordersPeriod} onChange={setOrdersPeriod} />
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyOrdersData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343434" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#b2beb5', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#b2beb5', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip suffix=" orders" />} />
              <Bar dataKey="orders" fill="#f2fd7d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default CustomerAnalyticsPage;