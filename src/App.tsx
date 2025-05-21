import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserRegistration from './UserRegistration';
import UserLogin from './UserLogin';
import UserHomePage from './UserHomePage';
import UserProfile from './UserProfile';
import MainLayout from './MainLayout';
import CartDetails from './CartDetails';
import ProductDashboard from './ProductDashboard';
import Unauthorized from './Unauthorized';
import ProtectedRoute from './ProtectedRoute';
import CreateProductForm from './CreateProductForm';
import UpdateProductForm from './UpdateProductForm';
import OrderDetails from './OrderDetails';


const App: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegistration />} />
        <Route element={<MainLayout />}>
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <UserHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute allowedRoles={[1, 0]}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-product/:id"
            element={
              <ProtectedRoute allowedRoles={[0]}>
                <UpdateProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart-details"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <CartDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/Product/Dashboard" element={
            <ProtectedRoute allowedRoles={[0]}>
              <ProductDashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-product" element={
            <ProtectedRoute allowedRoles={[0]}>
              <CreateProductForm />
            </ProtectedRoute>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>

      <style>{`
        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1100;
          background-color: #ffffff;
          background-color: #007BFF
          margin: 0;
          color: #24292e;
          font-weight: 800;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 0.5rem;
          border-radius: 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .app-body {
          padding-top: 60px; /* height of the header */
        }
      `}</style>
    </div>
  );
};

export default App;
