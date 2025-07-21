import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  // 1. ถ้ายังตรวจสอบสิทธิ์ไม่เสร็จ ให้แสดงหน้าโหลดดิ้ง
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-600">Initializing Session...</p>
      </div>
    );
  }

  // 2. ถ้าตรวจสอบเสร็จแล้ว และยังไม่ล็อกอิน ให้เด้งไปหน้า Login
  if (!isAuthenticated) {
    return <Navigate to="/auth/employee/login" state={{ from: location }} replace />;
  }

  // 3. ถ้าทุกอย่างผ่าน ให้แสดงหน้าที่ต้องการ
  return <>{children}</>;
};

export default ProtectedRoute;
