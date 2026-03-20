import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Phone, Download, Star, Loader2 } from 'lucide-react';
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
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await orderService.getOrderDetails(orderId);
      setOrder(orderData);
      if (orderData?.customer_rating) {
        setRating(orderData.customer_rating);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
      setError(err.response?.data?.message || 'Failed to load order details');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleRateOrder = async () => {
    if (customer_rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmittingRating(true);
      await orderService.rateOrder(orderId, {customer_rating: Number(customer_rating)});
      toast.success('Thank you for your rating!');
      setOrder(prev => ({ ...prev, customer_rating }));
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleReorder = () => {
    if (!order) return;
    
    navigate('/customer/new-order', {
      state: {
        fuel_type: order.fuel_type.id,
        quantity_liters: order.quantity_liters,
        delivery_address: order.delivery_address,
        notes: order.notes,
      }
    });
  };

  const handleDownloadReceipt = async () => {
    try {
      toast.info('Generating receipt...');
      await orderService.downloadReceipt(orderId);
      toast.success('Receipt downloaded successfully');
    } catch (err) {
      console.error('Failed to download receipt:', err);
      toast.error('Failed to download receipt');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#f2fd7d] animate-spin" />
          <p className="text-[#b2beb5]">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/customer/orders" className="text-[#f2fd7d] hover:underline text-sm mb-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-[#b2beb5] text-lg">{error || 'Order not found'}</p>
            <button
              onClick={loadOrder}
              className="px-4 py-2 bg-[#f2fd7d] text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link to="/customer/orders" className="text-[#f2fd7d] hover:underline text-sm mb-2 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Inter',sans-serif] font-bold text-3xl text-[#fcfcfc] mb-2">
                Order Details
              </h1>
              <p className="font-['Manrope',sans-serif] text-[#b2beb5]">
                #{order.order_number}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[order.status_display] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {order.status_display}
            </span>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
          <h2 className="font-['Inter',sans-serif] font-bold text-xl text-[#fcfcfc] mb-6">
            Order Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-[#b2beb5] text-sm mb-1">Fuel Type</p>
                <p className="text-[#fcfcfc] font-semibold capitalize">{order.fuel_type?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#b2beb5] text-sm mb-1">Quantity</p>
                <p className="text-[#fcfcfc] font-semibold">{order.quantity_liters} Liters</p>
              </div>
              <div>
                <p className="text-[#b2beb5] text-sm mb-1">Order Date</p>
                <p className="text-[#fcfcfc] font-semibold">
                  {format(new Date(order.created_at), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              {order.scheduled_time && (
                <div>
                  <p className="text-[#b2beb5] text-sm mb-1">Scheduled Delivery</p>
                  <p className="text-[#fcfcfc] font-semibold">
                    {format(new Date(order.scheduled_time), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[#b2beb5] text-sm mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Delivery Address
                </p>
                <p className="text-[#fcfcfc] font-semibold">{order.delivery_address || 'N/A'}</p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-[#b2beb5] text-sm mb-1">Special Instructions</p>
                  <p className="text-[#fcfcfc]">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Driver Information */}
        {order.driver && user?.user?.role == 'customer' &&(
          <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
            <h2 className="font-['Inter',sans-serif] font-bold text-xl text-[#fcfcfc] mb-6">
              Driver Information
            </h2>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#343434] rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h3 className="font-['Manrope',sans-serif] font-semibold text-[#fcfcfc] mb-1">
                    {order.driver?.user?.first_name || 'N/A'} {order.driver?.user?.last_name || ''}
                  </h3>
                  <p className="text-[#b2beb5] text-sm">{order.driver?.user?.phone || 'N/A'}</p>
                  {order.driver?.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-[#f2fd7d] fill-[#f2fd7d]" />
                      <span className="text-sm text-[#fcfcfc]">{order.driver.rating} Rating</span>
                    </div>
                  )}
                </div>
              </div>
              {order.driver?.user?.phone && (
                <button
                  className="border border-[#343434] text-[#fcfcfc] rounded-md px-4 py-2 text-sm font-medium hover:border-[#555] transition-colors inline-flex items-center gap-2"
                  onClick={() => window.location.href = `tel:${order.driver.user.phone}`}
                >
                  <Phone className="w-4 h-4" />
                  Call Driver
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
          <h2 className="font-['Inter',sans-serif] font-bold text-xl text-[#fcfcfc] mb-6">
            Pricing Breakdown
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between text-[#b2beb5]">
              <span>Fuel Cost ({order.quantity_liters}L × ₦{Number(order.fuel_type?.price_per_liter || 0).toLocaleString()})</span>
              <span className="text-[#fcfcfc]">
                ₦{Number(order.fuel_price || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[#b2beb5]">
              <span>Delivery Fee</span>
              <span className="text-[#fcfcfc]">₦{Number(order.delivery_fee || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#b2beb5]">
              <span>Service Charge</span>
              <span className="text-[#fcfcfc]">₦{Number(order.service_charge || 0).toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-[#343434] flex justify-between">
              <span className="font-['Inter',sans-serif] font-bold text-lg text-[#fcfcfc]">
                Total Amount
              </span>
              <span className="font-['Inter',sans-serif] font-bold text-2xl text-[#f2fd7d]">
                ₦{Number(order.total_price || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        {user.user?.role === 'customer' && order.status_display === 'Completed' && !order.customer_rating && (
          <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
            <h2 className="font-['Inter',sans-serif] font-bold text-xl text-[#fcfcfc] mb-4">
              Rate This Order
            </h2>
            <p className="text-[#b2beb5] text-sm mb-4">How was your experience?</p>
            <div className="flex items-center gap-4 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  disabled={submittingRating}
                  className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= customer_rating ? 'text-[#f2fd7d] fill-[#f2fd7d]' : 'text-[#343434]'
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={handleRateOrder}
              disabled={customer_rating === 0 || submittingRating}
              className="bg-[#f2fd7d] text-black hover:opacity-90 rounded-md text-sm font-medium transition-all h-9 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {submittingRating && <Loader2 className="w-4 h-4 animate-spin" />}
              {submittingRating ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        )}

        {/* Show existing rating */}
        {order.customer_rating && (
          <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
            <h2 className="font-['Inter',sans-serif] font-bold text-xl text-[#fcfcfc] mb-4">
              Your Rating
            </h2>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= order.customer_rating ? 'text-[#f2fd7d] fill-[#f2fd7d]' : 'text-[#343434]'
                  }`}
                />
              ))}
              <span className="text-[#fcfcfc] ml-2">{order.customer_rating.toFixed(1)} out of 5.0</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 flex-wrap">
          <button 
            onClick={handleDownloadReceipt}
            className="flex-1 min-w-[200px] border border-[#343434] text-[#fcfcfc] rounded-md text-sm font-medium transition-colors hover:border-[#555] h-10 px-4 inline-flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
          {user.user?.role === 'customer' && (
          <button  
            onClick={handleReorder}
            className="flex-1 min-w-[200px] bg-[#f2fd7d] text-black hover:opacity-90 rounded-md text-sm font-medium transition-all h-10 px-4 inline-flex items-center justify-center gap-2"
          >
            Reorder
          </button>
          )} 
        </div> 
      </div>
    </div>
  );
}

export default OrderDetailsPage;