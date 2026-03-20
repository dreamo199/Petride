import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'

function DashboardLayout({ role }) {
  return (
    <div className="h-screen flex">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
