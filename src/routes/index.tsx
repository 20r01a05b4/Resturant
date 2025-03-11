import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';
import ReservationPage from '../pages/ReservationPage';
import AdminReservationPage from '../pages/admin/AdminReservationPage'; 
import OrderPage from '../pages/OrderPage';
import AdminOrderPage from '../pages/admin/AdminOrderPage';  
import ContactPage from '../pages/ContactPage';
import AdminContactPage from '../pages/admin/AdminContactPage'; // Import Admin Contact Page
import BlogPage from '../pages/BlogPage';
import AdminDashboard from '../pages/admin/Dashboard';
import AuthPage from '../pages/AuthPage';
import UploadMenuItem from '../pages/admin/UploadMenuItem';
import Cart from '../pages/Cart';
import AdminCartPage from '../pages/admin/AdminCartPage'; 

function PrivateRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const user = localStorage.getItem("user");
  const userRole = localStorage.getItem("role") ?? "";

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (roles && !roles.includes(userRole?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  const userRole = localStorage.getItem("role") ?? "";

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="auth" element={<AuthPage />} />

        {/* Conditionally render the pages based on user role */}
        <Route path="order" element={userRole === "admin" ? <AdminOrderPage /> : <OrderPage />} />
        <Route path="reservation" element={userRole === "admin" ? <AdminReservationPage /> : <ReservationPage />} />
        <Route path="cart" element={userRole === "admin" ? <AdminCartPage /> : <Cart />} />
        <Route path="contact" element={userRole === "admin" ? <AdminContactPage /> : <ContactPage />} />

        {/* Admin-only Routes */}
        <Route
          path="upload-menu"
          element={
            <PrivateRoute roles={["admin"]}>
              <UploadMenuItem />
            </PrivateRoute>
          }
        />

        <Route
          path="dashboard"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}
