import { useState, useEffect } from 'react';
import { driverService } from '../../services/driver';
import { format } from 'date-fns';
import { Link } from 'react-router';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  Package,
  User,
  Loader2,
  AlertCircle,
  ChevronLeft,
  MessageSquare,
  XCircle,
  Droplets,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export function ActiveOrderPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    loadActiveOrder();
  }, []);

  const loadActiveOrder = async () => {
    try {
      setLoading(true);
      const aOrder = await driverService.activeOrder();
      console.log('Fetched active order:', aOrder);
      setActiveOrder(aOrder?.Order?.[0] || null);
    } catch (err) {
      console.error('Error fetching active order:', err);
      toast.error('Failed to load active order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status, cancellation_reason) => {
    const orderId = activeOrder?.id;

    if (!orderId) {
      toast.error("Order not loaded yet");
      return;
    }

    try {
      setUpdating(true);
      await driverService.updateOrderStatus(orderId, { 
        status: status, 
        cancellation_reason: cancellation_reason 
      });
      toast.success(`Status updated to ${status}`);
      await loadActiveOrder();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleCompleteDelivery = () => {
    setShowConfirmDialog(true);
  };

  const confirmComplete = async () => {
    const orderId = activeOrder?.id;

    if (!orderId) {
      toast.error("Order not loaded yet");
      return;
    }

    try {
      setUpdating(true);
      await driverService.updateOrderStatus(orderId, { status: 'completed' });
      toast.success('Delivery completed!', {
        description: 'Payment will be processed shortly'
      });
      setTimeout(() => {
        navigate('/driver/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Complete error:', error);
      toast.error('Failed to complete delivery');
    } finally {
      setUpdating(false);
      setShowConfirmDialog(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      in_transit: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      delivering: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      completed: 'bg-green-500/10 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  };

  const getStatusText = (status) => {
    const texts = {
      in_transit: 'En Route to Customer',
      completed: 'Delivery Completed',
      cancelled: 'Delivery Cancelled',
    };
    return texts[status] || 'Unknown Status';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
          <p className="text-[#b2beb5]">Loading active order...</p>
        </div>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-black">
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/driver/dashboard" 
              className="text-[#f2fd7d] hover:underline text-sm mb-4 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6 sm:p-12">
              <div className="w-20 h-20 rounded-full bg-[#343434] flex items-center justify-center">
                <Package className="w-10 h-10 text-[#888]" />
              </div>
              <div className="text-center">
                <h3 className="text-[#fcfcfc] text-xl font-bold mb-2">No Active Orders</h3>
                <p className="text-[#b2beb5] mb-6">You don't have any active deliveries at the moment</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={loadActiveOrder}
                  className="px-6 py-3 bg-[#f2fd7d] text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <Link
                  to="/driver/available-orders"
                  className="px-6 py-3 border border-[#343434] text-[#fcfcfc] rounded-xl text-sm font-semibold hover:bg-[#141414] transition-all"
                >
                  View Available Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="top-0 z-50 bg-black/95 backdrop-blur-lg border-b border-[#343434]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/driver/dashboard')}
                className="p-2 text-[#b2beb5] hover:text-[#fcfcfc] hover:bg-[#1a1a1a] rounded-xl transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-['Inter',sans-serif] font-bold text-xl sm:text-2xl text-[#fcfcfc]">
                  Active Delivery
                </h1>
                <p className="font-['Manrope',sans-serif] text-sm text-[#b2beb5] flex items-center gap-2">
                  {activeOrder.order_number}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(activeOrder.status)}`}>
                    {getStatusText(activeOrder.status)}
                  </span>
                </p>
              </div>
            </div>
            
            <button 
              onClick={loadActiveOrder}
              className="p-2 text-[#b2beb5] hover:text-[#fcfcfc] hover:bg-[#1a1a1a] rounded-xl transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => handleStatusUpdate('in_transit')}
              disabled={activeOrder.status === 'in_transit' || updating}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium whitespace-nowrap transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                activeOrder.status === 'in_transit' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                  : 'bg-[#1a1a1a] text-[#b2beb5] border-[#343434] hover:border-[#f2fd7d]'
              }`}
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              En Route
            </button>

            <button
              onClick={() => handleStatusUpdate('cancelled', 'driver')}
              disabled={activeOrder.status === 'completed' || updating}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium whitespace-nowrap transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                activeOrder.status === 'cancelled'
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'bg-[#1a1a1a] text-[#b2beb5] border-[#343434] hover:border-red-500/30'
              }`}
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Cancel Order
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 lg:pb-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Map & Navigation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Map */}
            <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl overflow-hidden hover:border-[#f2fd7d]/30 transition-all">
              <div className="relative h-[150px] sm:h-[150px] lg:h-[400px] bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-black flex items-center justify-center">
                {/* Animated background grid */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(#f2fd7d 1px, transparent 1px), linear-gradient(90deg, #f2fd7d 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                  }} />
                </div>

                <div className="text-center relative z-10">
                  <div className="relative inline-block">
                    <MapPin className="w-20 h-20 text-[#f2fd7d] animate-bounce" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black">
                      <div className="w-full h-full bg-green-400 rounded-full animate-ping" />
                    </div>
                  </div>
                  <p className="text-[#fcfcfc] font-bold text-xl mt-4">
                    {getStatusText(activeOrder.status)}
                  </p>
                  {activeOrder.status === 'in_transit' && (
                    <div className="flex items-center justify-center gap-2 mt-2 text-[#b2beb5]">
                      <Navigation className="w-4 h-4" />
                      <span>Navigate to customer location</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t border-[#343434] bg-[#0a0a0a]/50">
                <div className="bg-[#0a0a0a] border border-[#343434] rounded-xl overflow-hidden">
                </div>
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${activeOrder.delivery_address}`, '_blank')}
                  className="w-full bg-[#f2fd7d] text-black hover:bg-[#e5f06d] font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
                >
                  <Navigation className="w-5 h-5" />
                  Open in Google Maps
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => window.location.href = `tel:${activeOrder.customer_number}`}
                className="bg-[#0a0a0a] border border-[#343434] text-[#fcfcfc] hover:bg-[#141414] hover:border-[#f2fd7d] py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 font-semibold"
              >
                <div className="w-10 h-10 bg-[#f2fd7d]/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#f2fd7d]" />
                </div>
                <span>Call Customer</span>
              </button>
              <button 
                className="bg-[#0a0a0a] border border-[#343434] text-[#fcfcfc] hover:bg-[#141414] hover:border-[#f2fd7d] py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 font-semibold"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <span>Send Message</span>
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Customer Info Card */}
            <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6 hover:border-[#f2fd7d]/30 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#f2fd7d]/10 p-3 rounded-xl">
                  <User className="w-6 h-6 text-[#f2fd7d]" />
                </div>
                <h2 className="font-['Inter',sans-serif] font-bold text-lg text-[#fcfcfc]">
                  Customer Information
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#141414] rounded-xl p-4">
                  <p className="text-xs text-[#b2beb5] mb-2">Customer Name</p>
                  <p className="font-semibold text-[#fcfcfc] text-lg">{activeOrder.customer_name}</p>
                </div>
                <div className="bg-[#141414] rounded-xl p-4">
                  <p className="text-xs text-[#b2beb5] mb-2">Phone Number</p>
                  <p className="text-[#fcfcfc] font-mono">{activeOrder.customer_number}</p>
                </div>
                <div className="bg-[#141414] rounded-xl p-4">
                  <p className="text-xs text-[#b2beb5] mb-2">Customer ID</p>
                  <p className="text-[#fcfcfc] font-mono">{activeOrder.customer_id}</p>
                </div>
                <div className="bg-[#141414] rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#f2fd7d] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#b2beb5] mb-2">Delivery Address</p>
                      <p className="text-[#fcfcfc] text-sm leading-relaxed">{activeOrder.delivery_address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6 hover:border-[#f2fd7d]/30 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500/10 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="font-['Inter',sans-serif] font-bold text-lg text-[#fcfcfc]">
                  Order Details
                </h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-[#343434]">
                  <div className="flex items-center gap-2 text-[#b2beb5]">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm">Fuel Type</span>
                  </div>
                  <span className="text-[#fcfcfc] font-semibold">{activeOrder.fuel_type_name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#343434]">
                  <span className="text-[#b2beb5] text-sm">Quantity</span>
                  <span className="text-[#fcfcfc] font-semibold">{activeOrder.quantity_liters}L</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#343434]">
                  <div className="flex items-center gap-2 text-[#b2beb5]">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Scheduled Time</span>
                  </div>
                  <span className="text-[#fcfcfc] font-semibold text-sm">
                    {activeOrder.scheduled_time ? format(new Date(activeOrder.scheduled_time), 'MMM d, h:mm a') : 'ASAP'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#343434]">
                  <span className="text-[#b2beb5] text-sm">Delivery Fee</span>
                  <span className="text-[#f2fd7d] font-semibold">₦{Number(activeOrder.delivery_fee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-[#f2fd7d]/5 -mx-6 px-6 rounded-b-2xl mt-3">
                  <span className="text-[#fcfcfc] font-bold">Your Earnings</span>
                  <span className="text-[#f2fd7d] font-bold text-2xl">₦{Number(activeOrder.delivery_fee).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-orange-400 font-semibold mb-2">Safety Reminder</p>
                  <ul className="text-orange-300/80 text-sm space-y-1 leading-relaxed">
                    <li>• Follow proper fuel handling procedures</li>
                    <li>• Verify customer ID before delivery</li>
                    <li>• Ensure safe delivery environment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Delivery Button */}
        <div className="sticky bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-[#343434] p-4 -mx-4 sm:mx-0 sm:static sm:bg-transparent sm:border-0 sm:p-0">
          <button
            onClick={handleCompleteDelivery}
            disabled={activeOrder.status !== 'in_transit' || updating}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 px-8 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
          >
            <CheckCircle className="w-6 h-6" />
            Complete Delivery
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl max-w-md w-full p-5 sm:p-8 animate-in zoom-in duration-200 shadow-2xl">
            <div className="text-center mb-8">
              <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc] mb-3">
                Complete Delivery?
              </h3>
              <p className="text-[#b2beb5] leading-relaxed">
                Confirm that you have successfully delivered <span className="text-[#f2fd7d] font-semibold">{activeOrder.quantity_liters}L of {activeOrder.fuel_type_name}</span> to <span className="text-[#fcfcfc] font-semibold">{activeOrder.customer_name}</span>.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#343434] rounded-xl p-5 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#b2beb5]">Order Number</span>
                <span className="text-[#fcfcfc] font-semibold">{activeOrder.order_number}</span>
              </div>
              <div className="pt-3 border-t border-[#343434] flex justify-between items-center">
                <span className="text-[#b2beb5]">Your Earnings</span>
                <span className="text-[#f2fd7d] font-bold text-xl">₦{Number(activeOrder.delivery_fee).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                disabled={updating}
                className="flex-1 border border-[#343434] text-[#fcfcfc] hover:bg-[#141414] py-4 px-6 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmComplete}
                disabled={updating}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  'Confirm Delivery'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveOrderPage;