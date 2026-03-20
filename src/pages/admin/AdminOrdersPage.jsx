// src/pages/admin/OrdersPage.jsx
import React from "react";

const mockOrders = [
  { id: "ORD001", customer: "Amina", fuel: "PMS", qty: 30, status: "Pending" },
  { id: "ORD002", customer: "Tunde", fuel: "AGO", qty: 50, status: "Completed" },
];

function AdminOrdersPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">Order Overview</h2>

      <div className="bg-[#141414] border border-[#343434] rounded-xl overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-[#343434]">
          <div className="text-sm text-[#b2beb5]">Order ID</div>
          <div className="text-sm text-[#b2beb5]">Customer</div>
          <div className="text-sm text-[#b2beb5]">Fuel</div>
          <div className="text-sm text-[#b2beb5]">Qty (L)</div>
          <div className="text-sm text-[#b2beb5]">Status</div>
        </div>

        <div className="divide-y divide-[#343434]">
          {mockOrders.map((o) => (
            <div key={o.id} className="grid grid-cols-5 gap-4 px-6 py-4 items-center">
              <div className="text-white font-medium">{o.id}</div>
              <div className="text-[#b2beb5]">{o.customer}</div>
              <div className="text-[#b2beb5]">{o.fuel}</div>
              <div className="text-[#b2beb5]">{o.qty}</div>
              <div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  o.status === "Completed" ? "bg-[#4ade80]/20 text-[#4ade80]" : "bg-[#fbbf24]/20 text-[#fbbf24]"
                }`}>
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminOrdersPage;