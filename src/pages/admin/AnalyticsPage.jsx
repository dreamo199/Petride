// src/pages/admin/AnalyticsPage.jsx
import React from "react";
import StatsCard from "../../components/StatsCard";
import { Users, Truck, DollarSign } from "lucide-react";

function AnalyticsPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">Analytics</h2>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total customers" value="1,240" Icon={Users} />
        <StatsCard title="Total drivers" value="320" Icon={Truck} />
        <StatsCard title="Total revenue" value="₦12,400,000" Icon={DollarSign} />
      </div>

      <div className="bg-[#141414] border border-[#343434] rounded-xl p-4">
        <p className="text-[#b2beb5]">Charts will go here (chart.js / recharts)</p>
        <div className="mt-4 text-[#b2beb5] text-sm">
          Use a charting lib to visualize orders by day, revenue, and top suppliers.
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
