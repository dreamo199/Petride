import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Search, Filter, Download, X, ChevronDown, Package } from 'lucide-react';
import { orderService } from '../../services/order';
import { toast } from 'sonner';

const statusColors = {
  'Completed': 'bg-green-500/20 text-green-400 border-green-500/30',
  'In Transit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statuses = ['All', 'Pending', 'In Transit', 'Delivered', 'Cancelled'];

function OrdersHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleCancelOrder = async (orderId, status, reason) => {
    try {
      await orderService.updateOrderStatus(orderId, { status, cancellation_reason: reason });
      toast.success('Order Cancelled Successfully');
      loadOrder();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { loadOrder(); }, []);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data?.results || []);
    } catch (err) { console.error(err); }
  };

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    return (
      (order.order_number.toLowerCase().includes(q) || order.fuel_type_name.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || order.status_display === statusFilter)
    );
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 pb-24 lg:pb-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-technor font-black text-2xl sm:text-3xl text-white mb-1">My Orders</h1>
          <p className="font-switzer text-[#555] text-sm">View and manage your order history</p>
        </div>
        <button
          className="hidden sm:flex font-switzer items-center gap-2 h-9 px-4 rounded-xl text-[#555] text-sm border transition-all hover:text-white hover:border-[#333]"
          style={{ background: '#080808', borderColor: '#1a1a1a' }}
        >
          <Download size={14} /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-switzer w-full h-10 pl-9 pr-4 rounded-xl text-white placeholder-[#444] text-sm outline-none transition-all"
              style={{ background: '#111', border: '1px solid #222' }}
              onFocus={e => e.target.style.borderColor = '#f2fd7d'}
              onBlur={e => e.target.style.borderColor = '#222'}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-white">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="font-switzer flex items-center gap-2 h-10 px-4 rounded-xl text-sm text-white transition-all whitespace-nowrap"
              style={{ background: '#111', border: '1px solid #222' }}
            >
              <Filter size={13} className="text-[#444]" />
              <span className={statusFilter !== 'All' ? 'text-[#f2fd7d]' : 'text-[#888]'}>{statusFilter}</span>
              <ChevronDown size={13} className={`text-[#444] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-[calc(100%+6px)] left-0 w-44 rounded-xl py-1 z-50 overflow-hidden"
                style={{ background: '#111', border: '1px solid #222' }}>
                {statuses.map((status) => (
                  <button key={status}
                    onClick={() => { setStatusFilter(status); setDropdownOpen(false); }}
                    className={`font-switzer w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2.5 ${statusFilter === status ? 'text-white bg-[#1a1a1a]' : 'text-[#555] hover:text-white hover:bg-[#161616]'}`}
                  >
                    {status !== 'All' && (
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        status === 'Delivered' ? 'bg-green-400' : status === 'In Transit' ? 'bg-blue-400' :
                        status === 'Pending' ? 'bg-yellow-400' : 'bg-red-400'
                      }`} />
                    )}
                    {status === 'All' && <span className="w-1.5" />}
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {(searchQuery || statusFilter !== 'All') && (
          <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #161616' }}>
            <span className="font-switzer text-[#333] text-xs">Active filters:</span>
            {searchQuery && (
              <span className="font-switzer flex items-center gap-1.5 text-[#666] text-xs px-2.5 py-1 rounded-full"
                style={{ background: '#111', border: '1px solid #222' }}>
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="text-[#444] hover:text-white ml-0.5">
                  <X size={10} />
                </button>
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="font-switzer flex items-center gap-1.5 text-[#f2fd7d] text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(242,253,125,0.08)', border: '1px solid rgba(242,253,125,0.15)' }}>
                {statusFilter}
                <button onClick={() => setStatusFilter('All')} className="ml-0.5 hover:text-white">
                  <X size={10} />
                </button>
              </span>
            )}
            <button onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
              className="font-switzer text-[#333] hover:text-white text-xs ml-1 transition-colors">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
        <div className="overflow-x-auto w-full">
          <div className="min-w-[700px]">
            <table className="w-full">
              <thead style={{ background: '#060606', borderBottom: '1px solid #1a1a1a' }}>
                <tr>
                  {['Order #', 'Date', 'Fuel Type', 'Quantity', 'Total', 'Status', 'Actions'].map((col) => (
                    <th key={col} className="text-left px-5 py-4 font-switzer font-semibold text-[#444] text-xs tracking-wider uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, i) => (
                  <tr key={order.id}
                    className="transition-colors"
                    style={{ borderBottom: i < filteredOrders.length - 1 ? '1px solid #111' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#0d0d0d'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-5 py-4">
                      <span className="font-satoshi font-bold text-white text-sm">{order.order_number}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-switzer text-[#555] text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-switzer text-[#888] text-sm capitalize">{order.fuel_type_name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-technor text-white text-sm font-bold">{order.quantity_liters}L</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-technor font-bold text-[#f2fd7d] text-sm">₦{Number(order.total_price).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-switzer px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status_display]}`}>
                        {order.status_display}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <Link to={`/customer/orders/${order.id}`}
                          className="font-switzer text-[#f2fd7d] hover:text-white text-sm transition-colors font-medium">
                          View
                        </Link>
                        {order.status === 'in_transit' && (
                          <Link to={`/customer/tracking/${order.id}`}
                            className="font-switzer text-blue-400 hover:text-white text-sm transition-colors">
                            Track
                          </Link>
                        )}
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(order.id, 'cancelled', 'customer_request')}
                            className="font-switzer text-red-400 hover:text-white text-sm transition-colors">
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
              <Package size={22} className="text-[#333]" />
            </div>
            <div className="text-center">
              <p className="font-satoshi text-white text-sm font-semibold mb-1">No orders found</p>
              <p className="font-switzer text-[#444] text-xs">
                {searchQuery || statusFilter !== 'All' ? 'Try adjusting your filters' : "You haven't placed any orders yet"}
              </p>
            </div>
            {(searchQuery || statusFilter !== 'All') && (
              <button onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                className="font-switzer text-[#f2fd7d] text-xs hover:text-white transition-colors mt-1">
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersHistoryPage;