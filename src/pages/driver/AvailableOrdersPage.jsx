import { useEffect, useState } from 'react';
import { MapPin, Package, Clock, Fuel, Navigation, CheckCircle, ChevronRight, Loader2, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { driverService } from '../../services/driver';
import { orderService } from '../../services/order';

function AvailableOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingOrder, setAcceptingOrder] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadAvailableOrders();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAvailableOrders(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadAvailableOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const availableOrders = await driverService.availableOrders();
      setOrders(availableOrders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      if (!silent) {
        toast.error('Failed to load available orders');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    setAcceptingOrder(orderId);
    
    try {
      await driverService.acceptOrder(orderId);
      
      toast.success('Order accepted!', { 
        description: 'Navigating to active delivery...',
        icon: <CheckCircle size={16} />,
      });
      
      setTimeout(() => {
        navigate('/driver/active-order');
      }, 1000);
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order. Please try again.');
      setAcceptingOrder(null);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      await orderService.getOrderDetails(orderId);
      navigate(`/driver/orders/${orderId}`);
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Failed to load order details');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
          <p className="text-[#b2beb5]">Loading available orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-['Inter',sans-serif] font-bold text-3xl text-[#fcfcfc] mb-2">
            Available Orders
          </h1>
          <p className="text-[#b2beb5]">
            {orders.length > 0 
              ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} waiting for pickup`
              : 'No orders available right now'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 ${
              autoRefresh 
                ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                : 'bg-[#0a0a0a] text-[#b2beb5] border border-[#343434]'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className="hidden sm:inline">{autoRefresh ? 'Live' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order, index) => {
          const isAccepting = acceptingOrder === order.id;
          
          return (
            <div
              key={order.id}
              className="group bg-[#0a0a0a] border border-[#343434] rounded-2xl overflow-hidden hover:border-[#f2fd7d]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#f2fd7d]/5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Top section: Order # + Fee */}
              <div className="flex items-start justify-between p-6 sm:p-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[#fcfcfc] font-bold text-lg">
                      {order.order_number}
                    </h3>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                      New
                    </span>
                  </div>
                  <p className="text-[#b2beb5] text-sm">{order.fuel_type_name} delivery</p>
                </div>
                <div className="text-right">
                  <p className="text-[#f2fd7d] font-bold text-2xl">
                    ₦{order.delivery_fee.toLocaleString()}
                  </p>
                  <p className="text-[#b2beb5] text-xs mt-1">Delivery fee</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#343434]" />

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4 p-4 sm:p-6 bg-[#0a0a0a]/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f2fd7d]/10 flex items-center justify-center shrink-0">
                    <Fuel size={18} className="text-[#f2fd7d]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#b2beb5] text-xs mb-1">Fuel Type</p>
                    <p className="text-[#fcfcfc] font-semibold">
                      {order.fuel_type_name}
                    </p>
                    <p className="text-[#888] text-sm mt-0.5">{order.quantity_liters}L</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Navigation size={18} className="text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#b2beb5] text-xs mb-1">Distance</p>
                    <p className="text-[#fcfcfc] font-semibold">
                      {order.distance_km || '—'} km
                    </p>
                    <p className="text-[#888] text-sm mt-0.5">From you</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#343434]" />

              {/* Delivery address */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-3 bg-[#141414] rounded-xl p-4 mb-4 border border-[#343434]">
                  <MapPin size={18} className="text-[#f2fd7d] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#b2beb5] text-xs mb-2">Delivery Address</p>
                    <p className="text-[#fcfcfc] leading-relaxed">
                      {order.delivery_address}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    disabled={isAccepting}
                    className={`
                      flex-1 h-12 rounded-xl font-bold
                      transition-all duration-200
                      ${isAccepting
                        ? 'bg-[#f2fd7d]/50 text-black/50 cursor-not-allowed'
                        : 'bg-[#f2fd7d] text-black hover:bg-[#e5f06d] shadow-lg shadow-[#f2fd7d]/20'
                      }
                    `}
                  >
                    {isAccepting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Accepting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Accept Order
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-[#0a0a0a] border border-[#343434] rounded-2xl">
            <div className="w-20 h-20 rounded-2xl bg-[#141414] border border-[#343434] flex items-center justify-center mb-6">
              <Package size={32} className="text-[#888]" />
            </div>
            <h3 className="text-[#fcfcfc] font-bold text-xl mb-2">
              No Available Orders
            </h3>
            <p className="text-[#b2beb5] mb-6 text-center max-w-md">
              New orders will appear here automatically. Make sure you're online to receive orders.
            </p>
            
            {autoRefresh ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Listening for new orders...</span>
              </div>
            ) : (
              <button
                onClick={() => setAutoRefresh(true)}
                className="px-6 py-3 bg-[#f2fd7d] text-black rounded-xl font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Enable Auto-Refresh
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom info banner (if orders exist) */}
      {orders.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
              <Zap size={20} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-[#fcfcfc] font-semibold mb-1">
                {autoRefresh ? 'Auto-refresh is enabled' : 'Auto-refresh is paused'}
              </p>
              <p className="text-[#b2beb5] text-sm">
                {autoRefresh 
                  ? 'New orders will appear automatically every 30 seconds'
                  : 'Enable auto-refresh to see new orders automatically'
                }
              </p>
            </div>
            {autoRefresh && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Live</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Footer */}
      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0a0a0a] border border-[#343434] rounded-xl p-4 text-center">
            <p className="text-[#b2beb5] text-xs mb-1">Available Orders</p>
            <p className="text-[#fcfcfc] font-bold text-xl sm:text-2xl">{orders.length}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#343434] rounded-xl p-4 text-center">
            <p className="text-[#b2beb5] text-xs mb-1">Total Earnings</p>
            <p className="text-[#f2fd7d] font-bold text-xl sm:text-2xl">
              ₦{orders.reduce((sum, o) => sum + o.delivery_fee, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#343434] rounded-xl p-4 text-center">
            <p className="text-[#b2beb5] text-xs mb-1">Avg. Distance</p>
            <p className="text-[#fcfcfc] font-bold text-xl sm:text-2xl">
              {orders.length > 0 
                ? (orders.reduce((sum, o) => sum + (o.distance_km || 0), 0) / orders.length).toFixed(1)
                : '0'
              }km
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvailableOrdersPage;