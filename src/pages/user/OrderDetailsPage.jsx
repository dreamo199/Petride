import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Phone, Download, Star, Loader2, Fuel, Calendar, Package } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { orderService } from '../../services/order';
import { useAuth } from '../../contexts/AuthContext';

const statusColors = {
  'Completed': 'bg-green-500/20 text-green-400 border-green-500/30',
  'In Transit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
};

function OrderDetailsPage() {
  const { user } = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [customer_rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (!orderId) { setError('No order ID provided'); setLoading(false); return; }
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true); setError(null);
      const data = await orderService.getOrderDetails(orderId);
      setOrder(data);
      if (data?.customer_rating) setRating(data.customer_rating);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details');
      toast.error('Failed to load order details');
    } finally { setLoading(false); }
  };

  const handleRateOrder = async () => {
    if (customer_rating === 0) { toast.error('Please select a rating'); return; }
    try {
      setSubmittingRating(true);
      await orderService.rateOrder(orderId, { customer_rating: Number(customer_rating) });
      toast.success('Thank you for your rating!');
      setOrder(prev => ({ ...prev, customer_rating }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally { setSubmittingRating(false); }
  };

  const handleReorder = () => {
    if (!order) return;
    navigate('/customer/new-order', {
      state: { fuel_type: order.fuel_type.id, quantity_liters: order.quantity_liters, delivery_address: order.delivery_address, notes: order.notes }
    });
  };

  const handleDownloadReceipt = async () => {
    try {
      toast.info('Generating receipt...');
      await orderService.downloadReceipt(orderId);
      toast.success('Receipt downloaded');
    } catch { toast.error('Failed to download receipt'); }
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#f2fd7d] animate-spin" />
        <p className="font-switzer text-[#555]">Loading order details...</p>
      </div>
    </div>
  );

  if (error || !order) return (
    <div className="p-4 sm:p-6">
      <Link to="/customer/orders" className="font-switzer text-[#f2fd7d] text-sm mb-6 inline-flex items-center gap-2 hover:gap-3 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="font-switzer text-[#555]">{error || 'Order not found'}</p>
        <button onClick={loadOrder} className="font-switzer bg-[#f2fd7d] text-black px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <Link to="/customer/orders" className="font-switzer text-[#555] hover:text-[#f2fd7d] text-sm mb-4 inline-flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4 mt-2">
            <div>
              <h1 className="font-technor font-black text-2xl sm:text-3xl text-white mb-1">Order Details</h1>
              <p className="font-switzer text-[#444] text-sm">#{order.order_number}</p>
            </div>
            <span className={`font-switzer px-4 py-1.5 rounded-full text-xs font-semibold border ${statusColors[order.status_display] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {order.status_display}
            </span>
          </div>
        </div>

        {/* Order Info */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
          <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #111' }}>
            <div className="w-8 h-8 rounded-lg bg-[#f2fd7d]/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-[#f2fd7d]" />
            </div>
            <h2 className="font-satoshi font-bold text-white">Order Information</h2>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-5">
              {[
                { label: 'Fuel Type', value: order.fuel_type?.name || 'N/A' },
                { label: 'Quantity', value: `${order.quantity_liters} Liters` },
                { label: 'Order Date', value: format(new Date(order.created_at), 'EEEE, MMMM d, yyyy') },
                ...(order.scheduled_time ? [{ label: 'Scheduled Delivery', value: format(new Date(order.scheduled_time), 'EEEE, MMMM d, yyyy') }] : []),
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-switzer text-[#444] text-xs mb-1 uppercase tracking-wider">{label}</p>
                  <p className="font-switzer text-white font-medium capitalize">{value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-5">
              <div>
                <p className="font-switzer text-[#444] text-xs mb-1 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Delivery Address
                </p>
                <p className="font-switzer text-white font-medium">{order.delivery_address || 'N/A'}</p>
              </div>
              {order.notes && (
                <div>
                  <p className="font-switzer text-[#444] text-xs mb-1 uppercase tracking-wider">Special Instructions</p>
                  <p className="font-switzer text-[#888]">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Driver Info */}
        {order.driver && user?.user?.role === 'customer' && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
            <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #111' }}>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <h2 className="font-satoshi font-bold text-white">Driver Information</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: '#111', border: '1px solid #1a1a1a' }}>👤</div>
                  <div>
                    <p className="font-satoshi font-bold text-white mb-0.5">
                      {order.driver?.user?.first_name || 'N/A'} {order.driver?.user?.last_name || ''}
                    </p>
                    <p className="font-switzer text-[#555] text-sm">{order.driver?.user?.phone || 'N/A'}</p>
                    {order.driver?.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 text-[#f2fd7d] fill-[#f2fd7d]" />
                        <span className="font-switzer text-sm text-[#888]">{order.driver.rating} rating</span>
                      </div>
                    )}
                  </div>
                </div>
                {order.driver?.user?.phone && (
                  <button
                    onClick={() => window.location.href = `tel:${order.driver.user.phone}`}
                    className="font-switzer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-white"
                    style={{ background: '#111', border: '1px solid #1a1a1a' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#f2fd7d40'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
                  >
                    <Phone className="w-4 h-4 text-[#f2fd7d]" /> Call Driver
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
          <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #111' }}>
            <div className="w-8 h-8 rounded-lg bg-[#f2fd7d]/10 flex items-center justify-center">
              <Fuel className="w-4 h-4 text-[#f2fd7d]" />
            </div>
            <h2 className="font-satoshi font-bold text-white">Pricing Breakdown</h2>
          </div>
          <div className="p-6 space-y-3">
            {[
              { label: `Fuel (${order.quantity_liters}L × ₦${Number(order.fuel_type?.price_per_liter || 0).toLocaleString()})`, value: order.fuel_price || 0 },
              { label: 'Delivery Fee', value: order.delivery_fee || 0 },
              { label: 'Service Charge', value: order.service_charge || 0 },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="font-switzer text-[#555] text-sm">{label}</span>
                <span className="font-switzer text-[#888] text-sm">₦{Number(value).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 mt-1" style={{ borderTop: '1px solid #1a1a1a' }}>
              <span className="font-satoshi font-bold text-white text-lg">Total</span>
              <span className="font-technor font-black text-2xl text-[#f2fd7d]">₦{Number(order.total_price || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        {user.user?.role === 'customer' && order.status_display === 'Completed' && !order.customer_rating && (
          <div className="rounded-2xl p-6" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
            <h2 className="font-satoshi font-bold text-white mb-1">Rate This Order</h2>
            <p className="font-switzer text-[#444] text-sm mb-5">How was your delivery experience?</p>
            <div className="flex items-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} disabled={submittingRating}
                  className="transition-transform hover:scale-110 disabled:opacity-50">
                  <Star className={`w-8 h-8 transition-colors ${star <= customer_rating ? 'text-[#f2fd7d] fill-[#f2fd7d]' : 'text-[#222]'}`} />
                </button>
              ))}
            </div>
            <button onClick={handleRateOrder} disabled={customer_rating === 0 || submittingRating}
              className="font-switzer bg-[#f2fd7d] text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 inline-flex items-center gap-2">
              {submittingRating && <Loader2 className="w-4 h-4 animate-spin" />}
              {submittingRating ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        )}

        {order.customer_rating && (
          <div className="rounded-2xl p-6" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
            <h2 className="font-satoshi font-bold text-white mb-4">Your Rating</h2>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-6 h-6 ${star <= order.customer_rating ? 'text-[#f2fd7d] fill-[#f2fd7d]' : 'text-[#222]'}`} />
              ))}
              <span className="font-switzer text-[#555] text-sm ml-2">{order.customer_rating.toFixed(1)} / 5.0</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button onClick={handleDownloadReceipt}
            className="font-switzer flex-1 min-w-[160px] flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-medium text-white transition-all"
            style={{ background: '#080808', border: '1px solid #1a1a1a' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
          >
            <Download className="w-4 h-4" /> Download Receipt
          </button>
          {user.user?.role === 'customer' && (
            <button onClick={handleReorder}
              className="font-switzer flex-1 min-w-[160px] bg-[#f2fd7d] text-black font-bold h-11 px-5 rounded-xl text-sm hover:opacity-90 transition-all">
              Reorder
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;