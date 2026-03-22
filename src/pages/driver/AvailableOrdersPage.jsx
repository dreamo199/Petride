import { useEffect, useState } from 'react';
import { MapPin, Package, Fuel, Navigation, CheckCircle, Loader2, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { driverService } from '../../services/driver';

function AvailableOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingOrder, setAcceptingOrder] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => { loadAvailableOrders(); }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => loadAvailableOrders(true), 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadAvailableOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await driverService.availableOrders();
      setOrders(data || []);
    } catch {
      if (!silent) toast.error('Failed to load available orders');
    } finally { setLoading(false); setRefreshing(false); }
  };

  const handleAcceptOrder = async (orderId) => {
    setAcceptingOrder(orderId);
    try {
      await driverService.acceptOrder(orderId);
      toast.success('Order accepted!');
      setTimeout(() => navigate('/driver/active-order'), 1000);
    } catch {
      toast.error('Failed to accept order');
      setAcceptingOrder(null);
    }
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
        <p className="font-switzer text-[#555]">Loading orders...</p>
      </div>
    </div>
  );

  const totalPotential = orders.reduce((s, o) => s + (o.delivery_fee || 0), 0);
  const avgDistance = orders.length > 0
    ? (orders.reduce((s, o) => s + (o.distance_km || 0), 0) / orders.length).toFixed(1)
    : '0';

  return (
    <div className="p-4 sm:p-6 space-y-5 pb-24 lg:pb-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-[#333]'}`} />
            <span className={`font-switzer text-xs tracking-widest uppercase font-semibold ${autoRefresh ? 'text-green-400' : 'text-[#444]'}`}>
              {autoRefresh ? 'Live feed' : 'Paused'}
            </span>
          </div>
          <h1 className="font-technor font-black text-2xl sm:text-3xl text-white mb-1">
            Available Orders
          </h1>
          <p className="font-switzer text-[#444] text-sm">
            {orders.length > 0
              ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} waiting`
              : 'No orders right now'}
          </p>
        </div>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className="font-switzer px-4 py-2 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2"
          style={{
            background: autoRefresh ? 'rgba(74,222,128,0.08)' : '#0d0d0d',
            border: `1px solid ${autoRefresh ? 'rgba(74,222,128,0.2)' : '#1a1a1a'}`,
            color: autoRefresh ? '#4ade80' : '#444',
          }}>
          <Zap size={14} />
          {autoRefresh ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Summary stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Orders', value: orders.length, color: '#f2fd7d' },
            { label: 'Potential earnings', value: `₦${totalPotential.toLocaleString()}`, color: '#f2fd7d' },
            { label: 'Avg distance', value: `${avgDistance}km`, color: '#60a5fa' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl p-4 text-center"
              style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
              <p className="font-switzer text-[#444] text-xs mb-1">{label}</p>
              <p className="font-technor font-bold text-lg" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Order Cards */}
      <div className="space-y-4">
        {orders.map((order, index) => {
          const isAccepting = acceptingOrder === order.id;
          return (
            <div key={order.id}
              className="rounded-2xl overflow-hidden transition-all duration-300 group"
              style={{ background: '#080808', border: '1px solid #1a1a1a' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(242,253,125,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}>

              {/* Top accent line */}
              <div className="h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(242,253,125,0.3), transparent)' }} />

              {/* Header */}
              <div className="flex items-start justify-between p-5 sm:p-6">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-satoshi font-bold text-white text-lg">{order.order_number}</h3>
                    <span className="font-switzer px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa' }}>
                      New
                    </span>
                  </div>
                  <p className="font-switzer text-[#444] text-sm capitalize">{order.fuel_type_name} delivery</p>
                </div>
                <div className="text-right">
                  <p className="font-technor font-black text-2xl text-[#f2fd7d]">
                    ₦{Number(order.delivery_fee).toLocaleString()}
                  </p>
                  <p className="font-switzer text-[#333] text-xs mt-0.5">delivery fee</p>
                </div>
              </div>

              {/* Info row */}
              <div className="grid grid-cols-2 gap-3 px-5 sm:px-6 pb-5" style={{ borderTop: '1px solid #111' }}>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(242,253,125,0.08)' }}>
                    <Fuel size={16} className="text-[#f2fd7d]" />
                  </div>
                  <div>
                    <p className="font-switzer text-[#444] text-xs">Fuel</p>
                    <p className="font-satoshi font-semibold text-white text-sm capitalize">{order.fuel_type_name}</p>
                    <p className="font-technor text-[#666] text-xs">{order.quantity_liters}L</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(96,165,250,0.08)' }}>
                    <Navigation size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="font-switzer text-[#444] text-xs">Distance</p>
                    <p className="font-technor font-bold text-white text-sm">{order.distance_km || '—'} km</p>
                    <p className="font-switzer text-[#444] text-xs">From you</p>
                  </div>
                </div>
              </div>

              {/* Address + CTA */}
              <div className="px-5 sm:px-6 pb-5" style={{ borderTop: '1px solid #111' }}>
                <div className="flex items-start gap-3 rounded-xl p-4 mt-4 mb-4"
                  style={{ background: '#0d0d0d', border: '1px solid #161616' }}>
                  <MapPin size={15} className="text-[#f2fd7d] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-switzer text-[#444] text-xs mb-1 uppercase tracking-wider">Delivery Address</p>
                    <p className="font-switzer text-[#888] text-sm leading-relaxed">{order.delivery_address}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptOrder(order.id)}
                  disabled={isAccepting}
                  className="font-switzer w-full h-12 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: '#f2fd7d', color: '#000' }}>
                  {isAccepting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Accepting...</>
                    : <><CheckCircle className="w-4 h-4" /> Accept Order</>
                  }
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
              <Package size={30} className="text-[#2a2a2a]" />
            </div>
            <h3 className="font-technor font-black text-xl text-white mb-2">No Orders Available</h3>
            <p className="font-switzer text-[#444] text-sm text-center max-w-sm mb-6">
              New orders will appear here automatically. Make sure you're online.
            </p>
            {autoRefresh ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-switzer text-green-400 text-sm">Listening for orders...</span>
              </div>
            ) : (
              <button onClick={() => setAutoRefresh(true)}
                className="font-switzer px-6 py-3 bg-[#f2fd7d] text-black rounded-xl font-bold text-sm hover:opacity-90 transition-all inline-flex items-center gap-2">
                <Zap className="w-4 h-4" /> Enable Live Feed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AvailableOrdersPage;