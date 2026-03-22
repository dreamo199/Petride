import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router';
import { Search, Filter, Download, X, ChevronDown, Package } from 'lucide-react';
import { orderService } from '../../services/order';

const statusColors = {
  'Completed': 'bg-green-500/20 text-green-400 border-green-500/30',
  'In Transit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const fuelTypes = ['All', 'Petrol', 'Diesel'];

function DeliveryHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      (statusFilter === 'All' || order.fuel_type_name === statusFilter)
    );
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 pb-24 lg:pb-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-technor font-black text-2xl sm:text-3xl text-white mb-1">My Deliveries</h1>
          <p className="font-switzer text-[#444] text-sm">View your delivery history</p>
        </div>
        <button className="hidden sm:flex font-switzer items-center gap-2 h-9 px-4 rounded-xl text-[#444] text-sm transition-all hover:text-white"
          style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
          <Download size={13} /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333]" />
            <input type="text" placeholder="Search orders..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="font-switzer w-full h-10 pl-9 pr-4 rounded-xl text-white placeholder-[#333] text-sm outline-none transition-all"
              style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}
              onFocus={e => e.target.style.borderColor = '#f2fd7d'}
              onBlur={e => e.target.style.borderColor = '#1a1a1a'} />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#333] hover:text-white">
                <X size={12} />
              </button>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)}
              className="font-switzer flex items-center gap-2 h-10 px-4 rounded-xl text-sm whitespace-nowrap transition-all"
              style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', color: statusFilter !== 'All' ? '#f2fd7d' : '#444' }}>
              <Filter size={12} className="text-[#333]" />
              {statusFilter}
              <ChevronDown size={12} className={`text-[#333] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-[calc(100%+6px)] left-0 w-40 rounded-xl py-1 z-50"
                style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
                {fuelTypes.map((fuel) => (
                  <button key={fuel} onClick={() => { setStatusFilter(fuel); setDropdownOpen(false); }}
                    className={`font-switzer w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${statusFilter === fuel ? 'text-white bg-[#141414]' : 'text-[#444] hover:text-white hover:bg-[#111]'}`}>
                    {fuel !== 'All' && (
                      <span className={`w-1.5 h-1.5 rounded-full ${fuel === 'Petrol' ? 'bg-green-400' : 'bg-blue-400'}`} />
                    )}
                    {fuel === 'All' && <span className="w-1.5" />}
                    {fuel}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
        <div className="overflow-x-auto w-full">
          <div className="min-w-[650px]">
            <table className="w-full">
              <thead style={{ background: '#060606', borderBottom: '1px solid #111' }}>
                <tr>
                  {['Order #', 'Date', 'Fuel Type', 'Quantity', 'Earnings', 'Status', ''].map((col) => (
                    <th key={col} className="text-left px-5 py-4 font-switzer font-medium text-[#333] text-xs uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, i) => (
                  <tr key={order.id} className="transition-colors"
                    style={{ borderBottom: i < filteredOrders.length - 1 ? '1px solid #0d0d0d' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#0d0d0d'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-5 py-4">
                      <span className="font-satoshi font-bold text-white text-sm">{order.order_number}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-switzer text-[#444] text-sm">
                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-switzer text-[#666] text-sm capitalize">{order.fuel_type_name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-technor text-white text-sm font-bold">{order.quantity_liters}L</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-technor font-bold text-[#f2fd7d] text-sm">
                        ₦{Number(order.total_price).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-switzer px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status_display]}`}>
                        {order.status_display}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link to={`/driver/orders/${order.id}`}
                        className="font-switzer text-[#f2fd7d] hover:text-white text-sm transition-colors font-medium">
                        View
                      </Link>
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
              <Package size={22} className="text-[#2a2a2a]" />
            </div>
            <div className="text-center">
              <p className="font-satoshi text-white text-sm font-semibold mb-1">No deliveries found</p>
              <p className="font-switzer text-[#333] text-xs">
                {searchQuery || statusFilter !== 'All' ? 'Try adjusting your filters' : "You haven't completed any deliveries yet"}
              </p>
            </div>
            {(searchQuery || statusFilter !== 'All') && (
              <button onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                className="font-switzer text-[#f2fd7d] text-xs hover:text-white transition-colors">
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryHistoryPage;