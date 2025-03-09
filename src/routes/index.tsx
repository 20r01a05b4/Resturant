import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';
import ReservationPage from '../pages/ReservationPage';
import OrderPage from '../pages/OrderPage';
import ContactPage from '../pages/ContactPage';
import BlogPage from '../pages/BlogPage';
import AdminDashboard from '../pages/admin/Dashboard';
import EmployeeDashboard from '../pages/employee/Dashboard';
import AuthPage from '../pages/AuthPage';
import { useAuth } from '../hooks/useAuth';
import UploadMenuItem from '../pages/admin/UploadMenuItem';
import Cart from '../pages/Cart';

function PrivateRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { user, userRole } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="reservation" element={<ReservationPage />} />
        <Route path="order" element={<OrderPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="addMenu" element={<UploadMenuItem />} />
        <Route path="cart" element={<Cart />} />

        <Route
          path="admin/*"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="employee/*"
          element={
            <PrivateRoute roles={['employee']}>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}
