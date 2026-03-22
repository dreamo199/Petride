import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, RefreshCw, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { driverService } from '../../services/driver';
import { toast } from 'sonner';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0a0a] border border-[#343434] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-[#b2beb5] text-xs mb-1">{label}</p>
      <p className="text-white font-semibold text-sm">
        ₦{Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
};

function DriverEarningsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('8W');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await driverService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!analytics?.weekly_breakdown) return;
    const csv = [
      ['Week', 'Deliveries', 'Earnings', 'Distance'],
      ...analytics.weekly_breakdown.map(w => [
        new Date(w.week).toLocaleDateString(),
        w.deliveries,
        w.earnings,
        w.distance
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatCurrency = (amount) =>
    `₦${Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;

  const chartData = analytics?.weekly_breakdown?.map(w => ({
    week: new Date(w.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    earnings: w.earnings,
    deliveries: w.deliveries,
  })) || [];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
          <p className="text-[#b2beb5]">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  const totalEarnings = analytics?.earnings?.total_earnings || 0;
  const avgPerDelivery = analytics?.earnings?.average_per_delivery || 0;
  const recentEarnings = analytics?.recent_performance?.earnings_last_30_days || 0;
  const recentDeliveries = analytics?.recent_performance?.deliveries_last_30_days || 0;
  const totalDeliveries = analytics?.overview?.total_deliveries || 0;
  const totalDistance = analytics?.performance?.total_distance_km || 0;
  const rating = analytics?.ratings?.current_rating || 0;

  return (
    <div className="p-4 sm:p-6 space-y-6 pb-24 lg:pb-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-technor font-bold text-2xl sm:text-3xl text-[#fcfcfc] mb-1">
            Earnings Dashboard
          </h1>
          <p className="font-switzer text-[#b2beb5]">
            Track your earnings, deliveries, and performance
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="border border-[#343434] text-[#fcfcfc] hover:bg-[#141414] rounded-lg px-4 py-2 text-sm font-medium transition-all inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Earnings', value: formatCurrency(totalEarnings), icon: DollarSign, trend: '+12%' },
          { label: 'Last 30 Days', value: formatCurrency(recentEarnings), icon: Calendar, trend: '+8%' },
          { label: 'Avg Per Delivery', value: formatCurrency(avgPerDelivery), icon: TrendingUp, trend: '+5%' },
          { label: 'Total Deliveries', value: totalDeliveries, icon: Package, trend: `+${recentDeliveries}` },
        ].map(({ label, value, icon: Icon, trend }) => (
          <div key={label} className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-4 sm:p-5 hover:border-[#f2fd7d]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#f2fd7d]" />
              </div>
              <span className="flex items-center gap-1 text-xs text-green-400">
                <ArrowUpRight className="w-3 h-3" />
                {trend}
              </span>
            </div>
            <p className="font-switzer text-[#b2beb5] text-xs mb-2">{label}</p>
            <p className="font-technor font-bold text-xl sm:text-2xl text-[#fcfcfc]">{value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-satoshi font-semibold text-lg text-[#fcfcfc]">Earnings Trend</h2>
            <p className="font-switzer text-[#b2beb5] text-sm mt-1">Weekly breakdown</p>
          </div>
          <div className="flex items-center gap-1 bg-[#111] border border-[#343434] rounded-lg p-1">
            {['4W', '8W'].map((p) => (
              <button
                key={p}
                onClick={() => setChartPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  chartPeriod === p
                    ? 'bg-[#f2fd7d] text-black'
                    : 'text-[#b2beb5] hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartPeriod === '4W' ? chartData.slice(-4) : chartData}>
            <defs>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f2fd7d" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f2fd7d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#343434" vertical={false} />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#b2beb5', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#b2beb5', fontSize: 12 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="earnings" stroke="#f2fd7d" strokeWidth={3} fill="url(#earningsGrad)" dot={false} activeDot={{ r: 5, fill: '#f2fd7d', stroke: '#0a0a0a', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Performance + Rating */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <p className="font-switzer text-[#b2beb5] text-xs mb-2">Total Distance</p>
          <p className="font-technor font-bold text-2xl text-[#fcfcfc]">{Number(totalDistance).toFixed(1)} km</p>
        </div>
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <p className="font-switzer text-[#b2beb5] text-xs mb-2">Driver Rating</p>
          <p className="font-technor font-bold text-2xl text-[#f2fd7d]">⭐ {Number(rating).toFixed(1)}</p>
        </div>
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 hover:border-[#f2fd7d]/30 transition-all">
          <p className="font-switzer text-[#b2beb5] text-xs mb-2">Completion Rate</p>
          <p className="font-technor font-bold text-2xl text-green-400">
            {totalDeliveries > 0
              ? `${Math.round((totalDeliveries / (totalDeliveries + (analytics?.overview?.cancelled_deliveries || 0))) * 100)}%`
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Weekly Breakdown Table */}
      <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="font-satoshi font-semibold text-xl text-[#fcfcfc]">Weekly Breakdown</h2>
        </div>
        <div className="border-t border-[#343434]" />
        <div className="overflow-x-auto w-full">
          <div className="min-w-[500px]">
            <table className="w-full">
              <thead className="bg-[#111] border-b border-[#343434]">
                <tr>
                  {['Week', 'Deliveries', 'Earnings', 'Distance'].map((col) => (
                    <th key={col} className="text-left p-4 font-switzer font-semibold text-[#fcfcfc] text-sm">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartData.length > 0 ? chartData.map((row, i) => (
                  <tr key={i} className="border-b border-[#1f1f1f] hover:bg-[#111] transition-colors">
                    <td className="p-4 font-switzer text-[#fcfcfc] text-sm">{row.week}</td>
                    <td className="p-4 font-switzer text-[#fcfcfc] text-sm">{row.deliveries}</td>
                    <td className="p-4 font-switzer font-semibold text-[#f2fd7d] text-sm">
                      ₦{Number(row.earnings).toLocaleString()}
                    </td>
                    <td className="p-4 font-switzer text-[#fcfcfc] text-sm">
                      {analytics?.weekly_breakdown?.[i]?.distance?.toFixed(1) || '—'} km
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#555] font-switzer text-sm">
                      No delivery data yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverEarningsPage;