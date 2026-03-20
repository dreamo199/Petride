import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./layouts/DashboardLayout";

// Admin pages
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));

// Driver pages
const DriverDashboard = React.lazy(() => import("./pages/driver/DriverDashboard"));
const AvailableOrdersPage = React.lazy(() => import('./pages/driver/AvailableOrdersPage'))
const ActiveOrderPage = React.lazy(() => import('./pages/driver/ActiveOrderPage'));
const DeliveryHistoryPage = React.lazy(() => import('./pages/driver/DeliveryHistoryPage'));
const DriverProfilePage = React.lazy(() => import('./pages/driver/DriverProfilePage'));

// User pages
const CustomerDashboard = React.lazy(() => import("./pages/user/CustomerDashboard"));
const PlaceOrder = React.lazy(() => import("./pages/user/PlaceOrder"));
const OrderHistoryPage = React.lazy(() => import("./pages/user/OrderHistoryPage"));
const OrderDetailsPage = React.lazy(() => import("./pages/user/OrderDetailsPage"));
const CustomerAnalyticsPage = React.lazy(() => import("./pages/user/CustomerAnalyticsPage"));
const CustomerProfilePage = React.lazy(() => import('./pages/user/CustomerProfilePage'))

// Auth pages
const OnboardingPage = React.lazy(() => import("./pages/OnboardingPage"));
const SignupPage = React.lazy(() => import("./pages/SignupPage"));
const SigninPage = React.lazy(() => import("./pages/SigninPage"));

const queryClient = new QueryClient();

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-[#f2fd7d] border-t-transparent rounded-full animate-spin" />
      <div className="text-white text-sm">Loading...</div>
    </div>
  </div>
);

const PrivateRoute = ({ children, allowedTypes }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(user.user?.role || user.role)) {
    const userRole = user.user?.role || user.role;
    if (userRole === 'customer') return <Navigate to="/customer" replace />;
    if (userRole === 'driver') return <Navigate to="/driver" replace />;
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />
      
      {/* Customer routes */}
      <Route
        path="/customer"
        element={
          <PrivateRoute allowedTypes={['customer']}>
            <DashboardLayout role="customer" />
          </PrivateRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="new-order" element={<PlaceOrder />} />
        <Route path="analytics" element={<CustomerAnalyticsPage />} />
        <Route path="orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="profile" element={<CustomerProfilePage />}/>
      </Route>
      
      {/* Driver routes */}
      <Route
        path="/driver"
        element={
          <PrivateRoute allowedTypes={['driver']}>
            <DashboardLayout role="driver" />
          </PrivateRoute>
        }
      >
        <Route index element={<DriverDashboard />} />
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="available-orders" element={<AvailableOrdersPage />}/>
        <Route path="orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="active-order" element={<ActiveOrderPage />} />
        <Route path="history" element={<DeliveryHistoryPage />} />
        <Route path="profile" element={<DriverProfilePage />}/>
      </Route>
      
      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedTypes={['admin']}>
            <DashboardLayout role="admin" />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;