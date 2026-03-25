import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, MapPin, Navigation, Phone, RefreshCw, CheckCircle, Clock, Fuel } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { orderService } from '../../services/order';
import { toast } from 'sonner';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Driver marker — yellow
const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

// Auto-pan map when driver moves
function MapController({ driverPos }) {
  const map = useMap();
  useEffect(() => {
    if (driverPos) map.setView([driverPos.lat, driverPos.lng], map.getZoom());
  }, [driverPos, map]);
  return null;
}

function TrackingPage() {
  const { orderId } = useParams();
  const wsRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [driverPos, setDriverPos] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    loadOrder();
    connectWebSocket();
    return () => wsRef.current?.close();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrderDetails(orderId);
      setOrder(data);
      setOrderStatus(data.status);
      if (data.driver?.current_latitude && data.driver?.current_longitude) {
        setDriverPos({ lat: data.driver.current_latitude, lng: data.driver.current_longitude });
      }
    } catch { toast.error('Failed to load order'); }
    finally { setLoading(false); }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem('accessToken');
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000'}/ws/tracking/${orderId}/`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'location_update') {
          setDriverPos({ lat: data.latitude, lng: data.longitude });
          console.log(data)
          setLastUpdate(new Date());
        } else if (data.type === 'status_update') {
          setOrderStatus(data.status);
          if (data.status === 'completed') {
            toast.success('Your fuel has been delivered!');
          }
        }
      } catch {}
    };

    ws.onclose = () => {
      setConnected(false);
      // Reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = () => setConnected(false);
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <RefreshCw className="w-8 h-8 text-[#f2fd7d] animate-spin" />
    </div>
  );

  const deliveryPos = order?.delivery_latitude && order?.delivery_longitude
    ? { lat: parseFloat(order.delivery_latitude), lng: parseFloat(order.delivery_longitude) }
    : null;

  const defaultCenter = driverPos || deliveryPos || { lat: 6.5244, lng: 3.3792 };

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link to="/customer/orders"
            className="font-switzer text-[#444] hover:text-[#f2fd7d] text-sm mb-3 inline-flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <h1 className="font-technor font-black text-2xl sm:text-3xl text-white mb-1">Live Tracking</h1>
          <p className="font-switzer text-[#444] text-sm">
            {order?.order_number}
          </p>
        </div>

        {/* Connection status */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            background: connected ? 'rgba(74,222,128,0.06)' : 'rgba(239,68,68,0.06)',
            border: `1px solid ${connected ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}>
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className={`font-switzer text-xs font-semibold ${connected ? 'text-green-400' : 'text-red-400'}`}>
            {connected ? 'Connected' : 'Reconnecting...'}
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1a1a1a' }}>
        <div className="h-[400px] sm:h-[500px]">
          <MapContainer
            center={[defaultCenter.lat, defaultCenter.lng]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Driver marker */}
            {driverPos && (
              <Marker position={[driverPos.lat, driverPos.lng]} icon={driverIcon}>
                <Popup>
                  <p className="font-semibold">Driver Location</p>
                  {lastUpdate && <p className="text-xs text-gray-500">Updated {lastUpdate.toLocaleTimeString()}</p>}
                </Popup>
              </Marker>
            )}

            {/* Delivery destination */}
            {deliveryPos && (
              <Marker position={[deliveryPos.lat, deliveryPos.lng]}>
                <Popup>Delivery Location</Popup>
              </Marker>
            )}

            {driverPos && <MapController driverPos={driverPos} />}
          </MapContainer>
        </div>
      </div>

      {/* Status + Driver Info */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Order status */}
        <div className="rounded-2xl p-5 space-y-3"
          style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
          <h2 className="font-satoshi font-bold text-white">Order Status</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(96,165,250,0.1)' }}>
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="font-technor font-bold text-white capitalize">
                {orderStatus?.replace('_', ' ') || 'In Transit'}
              </p>
              <p className="font-switzer text-[#444] text-xs">
                {lastUpdate ? `Last updated ${lastUpdate.toLocaleTimeString()}` : 'Waiting for driver location...'}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2" style={{ borderTop: '1px solid #111' }}>
            {[
              { label: 'Fuel', value: order?.fuel_type?.name || 'N/A' },
              { label: 'Quantity', value: `${order?.quantity_liters}L` },
              { label: 'Total', value: `₦${Number(order?.total_price || 0).toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="font-switzer text-[#444] text-sm">{label}</span>
                <span className="font-switzer text-white text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Driver info */}
        {order?.driver && (
          <div className="rounded-2xl p-5"
            style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
            <h2 className="font-satoshi font-bold text-white mb-4">Your Driver</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#f2fd7d] rounded-2xl flex items-center justify-center">
                <span className="font-technor font-black text-black text-lg">
                  {order.driver.user?.first_name?.[0]}{order.driver.user?.last_name?.[0]}
                </span>
              </div>
              <div>
                <p className="font-satoshi font-bold text-white">
                  {order.driver.user?.first_name} {order.driver.user?.last_name}
                </p>
                <p className="font-switzer text-[#444] text-sm">{order.driver.vehicle_type}</p>
                <p className="font-switzer text-[#444] text-sm">{order.driver.vehicle_number}</p>
              </div>
            </div>
            {order.driver.user?.phone && (
              <button
                onClick={() => window.location.href = `tel:${order.driver.user.phone}`}
                className="font-switzer w-full h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                style={{ background: 'rgba(242,253,125,0.08)', border: '1px solid rgba(242,253,125,0.15)', color: '#f2fd7d' }}>
                <Phone className="w-4 h-4" /> Call Driver
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delivery Address */}
      <div className="rounded-2xl p-5 flex items-start gap-3"
        style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
        <MapPin className="w-5 h-5 text-[#f2fd7d] mt-0.5 shrink-0" />
        <div>
          <p className="font-switzer text-[#444] text-xs uppercase tracking-wider mb-1">Delivery Address</p>
          <p className="font-switzer text-white">{order?.delivery_address}</p>
        </div>
      </div>
    </div>
  );
}

export default TrackingPage;