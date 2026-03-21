import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router';
import { Search, Filter, Download, X, ChevronDown } from 'lucide-react';
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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const orderData = await orderService.getOrders();
      setOrders(orderData?.results);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.order_number.toLowerCase().includes(q) ||
      order.fuel_type_name.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || order.fuel_type_name === statusFilter; 
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-['Inter',sans-serif] font-bold text-2xl sm:text-3xl text-[#fcfcfc] mb-1">
          My Deliveries
        </h1>
        <p className="font-['Manrope',sans-serif] text-[#b2beb5] text-sm">
          View and manage your delivery history
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              type="text"
              placeholder="Search by order # or fuel type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full h-10 pl-9 pr-4 rounded-lg
                bg-[#141414] border border-[#343434]
                text-white placeholder-[#555] text-sm
                outline-none focus:border-[#555]
                transition-colors duration-200
              "
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Fuel type Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="
                flex items-center gap-2 h-10 px-4 rounded-lg
                bg-[#141414] border border-[#343434]
                text-white text-sm
                hover:border-[#555]
                transition-colors duration-200
                whitespace-nowrap
              "
            >
              <Filter size={14} className="text-[#666]" />
              <span className={statusFilter !== 'All' ? 'text-white' : 'text-[#888]'}>{statusFilter}</span>
              <ChevronDown size={14} className={`text-[#666] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="
                absolute top-[calc(100%+6px)] left-0 w-44
                bg-[#141414] border border-[#343434]
                rounded-lg shadow-lg shadow-black/40
                py-1 z-50
              ">
                {fuelTypes.map((fuels) => (
                  <button
                    key={fuels}
                    onClick={() => { setStatusFilter(fuels); setDropdownOpen(false); }}
                    className={`
                      w-full text-left px-4 py-2 text-sm
                      transition-colors duration-150
                      ${statusFilter === fuels
                        ? 'text-white bg-[#1f1f1f]'
                        : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {fuels !== 'All' && (
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          fuels === 'Petrol' ? 'bg-green-400' :
                          fuels === 'Diesel' ? 'bg-blue-400' :
                          'bg-red-400'
                        }`} />
                      )}
                      {fuels === 'All' && <span className="w-1.5" />}
                      {fuels}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export */}
          <button className="
            hidden sm:flex
            items-center gap-2 h-10 px-4 rounded-lg
            bg-[#141414] border border-[#343434]
            text-[#888] text-sm
            hover:text-white hover:border-[#555]
            transition-colors duration-200
            whitespace-nowrap
          ">
            <Download size={14} />
            Export
          </button>
        </div>

        {/* Active filter chips */}
        {(searchQuery || statusFilter !== 'All') && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1f1f1f]">
            <span className="text-[#555] text-xs">Filters:</span>

            {searchQuery && (
              <span className="flex items-center gap-1.5 bg-[#1f1f1f] border border-[#343434] text-[#aaa] text-xs px-2.5 py-1 rounded-full">
                Search: <span className="text-white">"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="text-[#666] hover:text-white transition-colors ml-0.5">
                  <X size={11} />
                </button>
              </span>
            )}

            {statusFilter !== 'All' && (
              <span className="flex items-center gap-1.5 bg-[#1f1f1f] border border-[#343434] text-[#aaa] text-xs px-2.5 py-1 rounded-full">
                Status: <span className="text-white">{statusFilter}</span>
                <button onClick={() => setStatusFilter('All')} className="text-[#666] hover:text-white transition-colors ml-0.5">
                  <X size={11} />
                </button>
              </span>
            )}

            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
              className="text-[#555] hover:text-white text-xs ml-1 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <div className='min-w-full'>
            <table className="w-full">
              <thead className="bg-[#111] border-b border-[#343434]">
                <tr>
                  {['Order #', 'Date', 'Fuel Type', 'Quantity', 'Total', 'Status', 'Actions'].map((col) => (
                    <th key={col} className="text-left p-4 font-['Manrope',sans-serif] font-semibold text-[#fcfcfc] text-sm">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#1f1f1f] hover:bg-[#111] transition-colors">
                    <td className="p-4">
                      <span className="font-['Manrope',sans-serif] font-medium text-[#fcfcfc] text-sm">
                        {order.order_number}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-['Manrope',sans-serif] text-[#b2beb5] text-sm">
                        {format(new Date(order.created_at), 'EEE, MMMM d, yyyy')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-['Manrope',sans-serif] text-[#fcfcfc] text-sm">
                        {order.fuel_type_name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-['Manrope',sans-serif] text-[#fcfcfc] text-sm">
                        {order.quantity_liters}L
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-['Manrope',sans-serif] font-semibold text-[#fcfcfc] text-sm">
                        ₦{Number(order.total_price).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status_display]}`}>
                        {order.status_display}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <Link 
                          to={`/driver/orders/${order.id}`}
                          className="text-[#f2fd7d] hover:text-white text-sm transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#141414] border border-[#343434] flex items-center justify-center">
              <Search size={20} className="text-[#555]" />
            </div>
            <p className="text-[#fcfcfc] text-sm font-medium">No orders found</p>
            <p className="text-[#555] text-xs">
              {searchQuery || statusFilter !== 'All'
                ? 'Try adjusting your filters'
                : "You haven't placed any orders yet"}
            </p>
            {(searchQuery || statusFilter !== 'All') && (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                className="mt-1 text-[#f2fd7d] hover:text-white text-xs transition-colors"
              >
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