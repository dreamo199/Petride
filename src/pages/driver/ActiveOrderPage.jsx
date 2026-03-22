import { useState, useEffect } from 'react';
import { driverService } from '../../services/driver';
import { format } from 'date-fns';
import { Link } from 'react-router';
import {
  MapPin, Phone, Navigation, CheckCircle, Clock, ArrowLeft,
  Package, User, Loader2, AlertCircle, ChevronLeft, MessageSquare,
  XCircle, Droplets, RefreshCw, Fuel
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export function ActiveOrderPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => { loadActiveOrder(); }, []);

  const loadActiveOrder = async () => {
    try {
      setLoading(true);
      const aOrder = await driverService.activeOrder();
      setActiveOrder(aOrder?.Order?.[0] || null);
    } catch { toast.error('Failed to load active order'); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (status, cancellation_reason) => {
    if (!activeOrder?.id) { toast.error('Order not loaded'); return; }
    try {
      setUpdating(true);
      await driverService.updateOrderStatus(activeOrder.id, { status, cancellation_reason });
      toast.success(`Status updated`);
      await loadActiveOrder();
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(false); }
  };

  const confirmComplete = async () => {
    if (!activeOrder?.id) { toast.error('Order not loaded'); return; }
    try {
      setUpdating(true);
      await driverService.updateOrderStatus(activeOrder.id, { status: 'completed' });
      toast.success('Delivery completed!');
      setTimeout(() => navigate('/driver/dashboard'), 1500);
    } catch { toast.error('Failed to complete delivery'); }
    finally { setUpdating(false); setShowConfirmDialog(false); }
  };

  const getStatusColor = (status) => ({
    in_transit: 'text-blue-400 border-blue-500/30',
    completed: 'text-green-400 border-green-500/30',
    cancelled: 'text-red-400 border-red-500/30',
  }[status] || 'text-gray-400 border-gray-500/30');

  const getStatusText = (status) => ({
    in_transit: 'En Route',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }[status] || 'Unknown');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#000' }}>
      <div className="text-center">
        <RefreshCw className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
        <p className="font-switzer text-[#555]">Loading active order...</p>
      </div>
    </div>
  );

  if (!activeOrder) return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: '#000' }}>
      <div className="max-w-4xl mx-auto pt-6">
        <Link to="/driver/dashboard"
          className="font-switzer text-[#444] hover:text-[#f2fd7d] text-sm mb-6 inline-flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-5 rounded-2xl p-8"
          style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
            <Package className="w-10 h-10 text-[#2a2a2a]" />
          </div>
          <div className="text-center">
            <h3 className="font-technor font-black text-2xl text-white mb-2">No Active Orders</h3>
            <p className="font-switzer text-[#444] text-sm">You don't have any active deliveries right now</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={loadActiveOrder}
              className="font-switzer px-6 py-3 bg-[#f2fd7d] text-black rounded-xl text-sm font-bold hover:opacity-90 transition-all inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <Link to="/driver/available-orders"
              className="font-switzer px-6 py-3 text-[#888] rounded-xl text-sm font-medium transition-all text-center"
              style={{ border: '1px solid #1a1a1a' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}>
              View Available Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-32" style={{ background: '#000' }}>

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 px-4 sm:px-6 py-4"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #111' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/driver/dashboard')}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all text-[#444] hover:text-white"
              style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-technor font-black text-lg text-white leading-none">
                Active Delivery
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-switzer text-xs text-[#444]">{activeOrder.order_number}</span>
                <span className={`font-switzer text-xs px-2 py-0.5 rounded-full border ${getStatusColor(activeOrder.status)}`}
                  style={{ background: 'rgba(0,0,0,0.5)' }}>
                  {getStatusText(activeOrder.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusUpdate('in_transit')}
              disabled={activeOrder.status === 'in_transit' || updating}
              className="font-switzer flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-40"
              style={{
                background: activeOrder.status === 'in_transit' ? 'rgba(96,165,250,0.1)' : '#0d0d0d',
                border: `1px solid ${activeOrder.status === 'in_transit' ? 'rgba(96,165,250,0.3)' : '#1a1a1a'}`,
                color: activeOrder.status === 'in_transit' ? '#60a5fa' : '#666',
              }}>
              {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
              En Route
            </button>
            <button
              onClick={() => handleStatusUpdate('cancelled', 'driver')}
              disabled={activeOrder.status === 'completed' || updating}
              className="font-switzer flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-40"
              style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', color: '#555' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#555'; }}>
              <XCircle className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Left — Map + Actions */}
          <div className="lg:col-span-2 space-y-5">

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
              <div className="relative h-[280px] sm:h-[380px] flex items-center justify-center overflow-hidden"
                style={{
                  backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}>
                <div className="absolute inset-0"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(242,253,125,0.04) 0%, transparent 70%)' }} />
                <div className="text-center relative z-10">
                  <div className="relative inline-block mb-4">
                    <MapPin className="w-16 h-16 text-[#f2fd7d]" style={{ filter: 'drop-shadow(0 0 12px rgba(242,253,125,0.4))' }} />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black">
                      <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75" />
                    </div>
                  </div>
                  <p className="font-satoshi font-bold text-white text-lg">{getStatusText(activeOrder.status)}</p>
                  <p className="font-switzer text-[#444] text-sm mt-1">Navigating to customer</p>
                </div>
              </div>

              <div className="p-4" style={{ borderTop: '1px solid #111' }}>
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${activeOrder.delivery_address}`, '_blank')}
                  className="font-switzer w-full h-11 bg-[#f2fd7d] text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  <Navigation className="w-4 h-4" /> Open in Google Maps
                </button>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => window.location.href = `tel:${activeOrder.customer_number}`}
                className="font-switzer flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-semibold text-sm transition-all"
                style={{ background: '#080808', border: '1px solid #1a1a1a' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(242,253,125,0.25)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(242,253,125,0.1)' }}>
                  <Phone className="w-4 h-4 text-[#f2fd7d]" />
                </div>
                <span className="text-white">Call Customer</span>
              </button>
              <button
                className="font-switzer flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-semibold text-sm transition-all"
                style={{ background: '#080808', border: '1px solid #1a1a1a' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(96,165,250,0.25)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(96,165,250,0.1)' }}>
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-white">Send Message</span>
              </button>
            </div>
          </div>

          {/* Right — Details */}
          <div className="space-y-5">

            {/* Customer Info */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
              <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #111' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(242,253,125,0.1)' }}>
                  <User className="w-3.5 h-3.5 text-[#f2fd7d]" />
                </div>
                <h2 className="font-satoshi font-bold text-white text-sm">Customer</h2>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: 'Name', value: activeOrder.customer_name },
                  { label: 'Phone', value: activeOrder.customer_number },
                  { label: 'Customer ID', value: activeOrder.customer_id },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-3" style={{ background: '#0d0d0d' }}>
                    <p className="font-switzer text-[#333] text-xs uppercase tracking-wider mb-1">{label}</p>
                    <p className="font-switzer text-white text-sm font-medium">{value}</p>
                  </div>
                ))}
                <div className="rounded-xl p-3" style={{ background: '#0d0d0d' }}>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#f2fd7d] mt-0.5 shrink-0" />
                    <div>
                      <p className="font-switzer text-[#333] text-xs uppercase tracking-wider mb-1">Address</p>
                      <p className="font-switzer text-white text-sm leading-relaxed">{activeOrder.delivery_address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
              <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #111' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(96,165,250,0.1)' }}>
                  <Package className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <h2 className="font-satoshi font-bold text-white text-sm">Order Details</h2>
              </div>
              <div className="p-5 space-y-2">
                {[
                  { label: 'Fuel Type', value: activeOrder.fuel_type_name, icon: Droplets },
                  { label: 'Quantity', value: `${activeOrder.quantity_liters}L`, icon: null },
                  { label: 'Scheduled', value: activeOrder.scheduled_time ? format(new Date(activeOrder.scheduled_time), 'MMM d, h:mm a') : 'ASAP', icon: Clock },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex justify-between items-center py-2.5"
                    style={{ borderBottom: '1px solid #111' }}>
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="w-3.5 h-3.5 text-[#333]" />}
                      <span className="font-switzer text-[#444] text-sm">{label}</span>
                    </div>
                    <span className="font-switzer text-white text-sm font-medium">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 mt-1">
                  <span className="font-satoshi font-bold text-white">Your Earnings</span>
                  <span className="font-technor font-black text-2xl text-[#f2fd7d]">
                    ₦{Number(activeOrder.delivery_fee).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Safety */}
            <div className="rounded-2xl p-4"
              style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.15)' }}>
              <div className="flex gap-3">
                <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-satoshi font-semibold text-orange-400 text-sm mb-2">Safety Reminder</p>
                  <ul className="font-switzer text-orange-300/60 text-xs space-y-1">
                    <li>· Follow proper fuel handling procedures</li>
                    <li>· Verify customer ID before delivery</li>
                    <li>· Ensure safe delivery environment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Complete Button */}
      <div className="left-4 right-4 z-40 md:left-[calc(72px+1rem)] lg:left-[calc(220px+1rem)]">
        <button
          onClick={() => setShowConfirmDialog(true)}
          disabled={activeOrder.status !== 'in_transit' || updating}
          className="font-switzer w-full h-14 rounded-2xl font-black text-base disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          style={{
            background: '#4ade80',
            color: '#000',
            boxShadow: '0 8px 32px rgba(74,222,128,0.25)',
          }}>
          <CheckCircle className="w-5 h-5" />
          Complete Delivery
        </button>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 sm:p-8"
            style={{ background: '#080808', border: '1px solid #1a1a1a' }}>

            {/* Top glow */}
            <div className="w-full h-px mb-8"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)' }} />

            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-technor font-black text-2xl text-white mb-3">Complete Delivery?</h3>
              <p className="font-switzer text-[#444] text-sm leading-relaxed">
                Confirm delivery of{' '}
                <span className="text-[#f2fd7d] font-semibold">{activeOrder.quantity_liters}L of {activeOrder.fuel_type_name}</span>
                {' '}to{' '}
                <span className="text-white font-semibold">{activeOrder.customer_name}</span>
              </p>
            </div>

            <div className="rounded-xl p-4 mb-6 space-y-3"
              style={{ background: '#0d0d0d', border: '1px solid #111' }}>
              <div className="flex justify-between">
                <span className="font-switzer text-[#444] text-sm">Order</span>
                <span className="font-switzer text-white text-sm font-semibold">{activeOrder.order_number}</span>
              </div>
              <div className="flex justify-between pt-3" style={{ borderTop: '1px solid #161616' }}>
                <span className="font-switzer text-[#444] text-sm">Your Earnings</span>
                <span className="font-technor font-black text-xl text-[#f2fd7d]">₦{Number(activeOrder.delivery_fee).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfirmDialog(false)} disabled={updating}
                className="font-switzer flex-1 py-3.5 rounded-xl text-sm font-semibold text-[#555] transition-all disabled:opacity-50"
                style={{ border: '1px solid #1a1a1a' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}>
                Cancel
              </button>
              <button onClick={confirmComplete} disabled={updating}
                className="font-switzer flex-1 py-3.5 rounded-xl text-sm font-bold text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: '#4ade80' }}>
                {updating ? <><Loader2 className="w-4 h-4 animate-spin" /> Confirming...</> : 'Confirm Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveOrderPage;