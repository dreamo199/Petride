import { Users, Truck, DollarSign } from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import OrdersTable from '../../components/OrdersTable';

const mockOrders = [
  { id: 'ORD001', fuelType: 'Diesel', volume: 500, status: 'Pending' },
  { id: 'ORD002', fuelType: 'Fuel', volume: 400, status: 'Completed' },
  { id: 'ORD003', fuelType: 'Diesel', volume: 500, status: 'Completed' },
  { id: 'ORD004', fuelType: 'Diesel', volume: 350, status: 'Completed' },
  { id: 'ORD005', fuelType: 'Fuel', volume: 400, status: 'Completed' },
];

function AdminDashboard() {
  return (
    <div className="flex-1 p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-['Manrope',sans-serif] font-semibold text-2xl text-[#fcfcfc]">
            Dashboard
          </p>
          <p className="font-['Manrope',sans-serif] font-medium text-sm text-[#b2beb5] mt-1">
            Welcome back, Edgar
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 mb-10">
        <StatsCard
          title="Total customers"
          value="812"
          Icon={Users}
        />
        <StatsCard
          title="Total drivers"
          value="201"
          Icon={Truck}
        />
        <StatsCard
          title="Total revenue"
          value="$400,000"
          Icon={DollarSign}
        />
      </div>

      {/* Orders Table */}
      <OrdersTable
        title="Recent Orders"
        orders={mockOrders}
        showFilter={true}
        filterLabel="Driver"
      />
    </div>
  );
}


export default AdminDashboard;