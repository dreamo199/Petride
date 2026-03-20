import { Link } from "react-router-dom";
import { ArrowRight, Droplets, Package } from "lucide-react";

const statusColors = {
  'Completed': 'bg-green-500/20 text-green-400 border-green-500/30',
  'In Transit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const OrdersTable = ({ orders }) =>{
    return (
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5">
                  <h2 className="font-['Inter',sans-serif] font-semibold text-xl text-[#fcfcfc]">
                    Recent Orders
                  </h2>
                  <Link
                    to="/customer/orders"
                    className="text-[#f2fd7d] text-sm font-medium flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    View All <ArrowRight size={14} />
                  </Link>
                </div>
        
                <div className="border-t border-[#343434]" />
        
                {orders.length > 0 ? (
                  <div>
                    {orders.map((order, i) => (
                      <div key={order.id}>
                        <Link
                          to={`/customer/orders/${order.id}`}
                          className="flex items-center justify-between px-6 py-4 hover:bg-[#141414] transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#343434] flex items-center justify-center group-hover:border-[#f2fd7d]/30 transition-all">
                              <Droplets size={18} className="text-[#888]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <p className="text-[#fcfcfc] font-semibold">{order.order_number}</p>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status_display]}`}>
                                  {order.status_display}
                                </span>
                              </div>
                              <p className="text-[#b2beb5] text-sm flex items-center gap-2">
                                <span>{order.fuel_type_name}</span>
                                <span>•</span>
                                <span>{order.quantity_liters}L</span>
                                <span>•</span>
                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                              </p>
                            </div>
                          </div>
        
                          <div className="flex items-center gap-4">
                            <p className="text-[#fcfcfc] font-bold">
                              ₦ {Number(order.total_price).toLocaleString()}
                            </p>
                            <ArrowRight size={16} className="text-[#343434] group-hover:text-[#f2fd7d] transition-colors" />
                          </div>
                        </Link>
        
                        {i < orders.length - 1 && <div className="mx-6 border-t border-[#343434]" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-14 h-14 rounded-xl bg-[#141414] border border-[#343434] flex items-center justify-center">
                      <Package size={24} className="text-[#555]" />
                    </div>
                    <p className="text-[#fcfcfc] font-medium">No orders yet</p>
                    <p className="text-[#b2beb5] text-sm">Your recent orders will show up here</p>
                    <Link
                      to="/customer/new-order"
                      className="mt-2 bg-[#f2fd7d] text-black px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Place Your First Order
                    </Link>
                  </div>
                )}
              </div>
    )
}

export default OrdersTable;