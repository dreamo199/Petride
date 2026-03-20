import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatsCard } from '@/app/components/dashboard/StatsCard';
import { Button } from '@/app/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { driverApi } from '@/app/services/driverApi';
import { toast } from 'sonner';

function DriverEarningsPage() {
  const [earnings, setEarnings] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [chartPeriod, setChartPeriod] = useState(7);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [earningsData, chartData, transactionsData, statsData] = await Promise.all([
        driverApi.getEarnings(),
        driverApi.getEarningsChart(chartPeriod),
        driverApi.getTransactions({ limit: 10 }),
        driverApi.getStats(),
      ]);

      setEarnings(earningsData);
      setChartData(chartData);
      setTransactions(transactionsData.results || transactionsData);
      setAvailableBalance(statsData.available_balance || 0);
      setPendingBalance(statsData.pending_balance || 0);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    toast.success('Data refreshed');
  };

  const handleRequestPayout = async () => {
    if (availableBalance <= 0) {
      toast.error('No balance available for payout');
      return;
    }

    try {
      await driverApi.requestPayout(availableBalance);
      toast.success('Payout request submitted successfully');
      fetchAllData();
    } catch (error) {
      console.error('Error requesting payout:', error);
      toast.error('Failed to request payout');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Order', 'Amount', 'Status'],
      ...transactions.map(t => [t.date, t.order_number, t.amount, t.status])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
  };

  const formatTrend = (trend) => {
    const isPositive = trend >= 0;
    return (
      <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {Math.abs(trend)}%
      </span>
    );
  };

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Inter',sans-serif] font-bold text-3xl text-[#fcfcfc] mb-2">
            Earnings Dashboard
          </h1>
          <p className="font-['Manrope',sans-serif] text-[#b2beb5]">
            Track your earnings, payouts, and transaction history
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="border-[#343434] text-[#fcfcfc] hover:bg-[#141414]"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-10 h-10 text-[#f2fd7d]" />
            {earnings && formatTrend(earnings.todayTrend)}
          </div>
          <p className="text-[#b2beb5] text-sm mb-2">Today's Earnings</p>
          <p className="font-['Inter',sans-serif] font-bold text-3xl text-[#fcfcfc]">
            {earnings ? formatCurrency(earnings.today) : '₦0'}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 text-[#f2fd7d]" />
            {earnings && formatTrend(earnings.weekTrend)}
          </div>
          <p className="text-[#b2beb5] text-sm mb-2">This Week</p>
          <p className="font-['Inter',sans-serif] font-bold text-3xl text-[#fcfcfc]">
            {earnings ? formatCurrency(earnings.week) : '₦0'}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-10 h-10 text-[#f2fd7d]" />
            {earnings && formatTrend(earnings.monthTrend)}
          </div>
          <p className="text-[#b2beb5] text-sm mb-2">This Month</p>
          <p className="font-['Inter',sans-serif] font-bold text-3xl text-[#fcfcfc]">
            {earnings ? formatCurrency(earnings.month) : '₦0'}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 text-[#f2fd7d]" />
            {earnings && formatTrend(earnings.totalTrend)}
          </div>
          <p className="text-[#b2beb5] text-sm mb-2">Total Lifetime</p>
          <p className="font-['Inter',sans-serif] font-bold text-3xl text-[#fcfcfc]">
            {earnings ? formatCurrency(earnings.total) : '₦0'}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Inter',sans-serif] font-bold text-xl text-[#fcfcfc]">
            Earnings Trend
          </h2>
          <div className="flex gap-2">
            <Button
              variant={chartPeriod === 7 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartPeriod(7)}
              className={chartPeriod === 7 ? 'bg-[#f2fd7d] text-black' : 'border-[#343434] text-[#fcfcfc]'}
            >
              7 Days
            </Button>
            <Button
              variant={chartPeriod === 30 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartPeriod(30)}
              className={chartPeriod === 30 ? 'bg-[#f2fd7d] text-black' : 'border-[#343434] text-[#fcfcfc]'}
            >
              30 Days
            </Button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f2fd7d" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f2fd7d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#343434" />
            <XAxis 
              dataKey="date" 
              stroke="#b2beb5"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#b2beb5"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #343434',
                borderRadius: '12px',
                color: '#fcfcfc',
              }}
              formatter={(value) => [formatCurrency(value), 'Earnings']}
            />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="#f2fd7d" 
              strokeWidth={3}
              fill="url(#earningsGradient)"
              dot={{ fill: '#f2fd7d', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Payout Section */}
      <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Inter',sans-serif] font-bold text-xl text-[#fcfcfc]">
            Balance & Payouts
          </h2>
          <Button 
            onClick={handleRequestPayout}
            disabled={availableBalance <= 0}
            className="bg-[#f2fd7d] text-black hover:bg-[#f2fd7d]/90 disabled:opacity-50"
          >
            Request Payout
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#f2fd7d]/10 to-transparent border border-[#f2fd7d]/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#f2fd7d]/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#f2fd7d]" />
              </div>
              <p className="text-[#b2beb5] text-sm">Available for Payout</p>
            </div>
            <p className="font-['Inter',sans-serif] font-bold text-4xl text-[#f2fd7d]">
              {formatCurrency(availableBalance)}
            </p>
          </div>
          <div className="bg-[#141414] border border-[#343434] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#343434] rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-[#b2beb5]" />
              </div>
              <p className="text-[#b2beb5] text-sm">Pending Clearance</p>
            </div>
            <p className="font-['Inter',sans-serif] font-bold text-4xl text-[#fcfcfc]">
              {formatCurrency(pendingBalance)}
            </p>
            <p className="text-xs text-[#b2beb5] mt-2">Clears in 2-3 business days</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-['Inter',sans-serif] font-bold text-xl text-[#fcfcfc]">
              Recent Transactions
            </h2>
            <p className="text-sm text-[#b2beb5] mt-1">
              Last {transactions.length} transactions
            </p>
          </div>
          <Button 
            onClick={handleExport}
            variant="outline" 
            className="border-[#343434] text-[#fcfcfc] hover:bg-[#141414]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between bg-[#141414] border border-[#343434] rounded-xl p-4 hover:border-[#f2fd7d]/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#f2fd7d]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#fcfcfc] mb-1">{transaction.order_number}</p>
                    <p className="text-sm text-[#b2beb5]">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-[#f2fd7d]">
                    +{formatCurrency(transaction.amount)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                    transaction.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-[#343434] mx-auto mb-3" />
              <p className="text-[#b2beb5]">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}