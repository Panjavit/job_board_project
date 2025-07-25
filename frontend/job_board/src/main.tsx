import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layout/MainLayout.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import EmployeeLoginPage from './pages/EmployeeLoginPage.tsx';
import EmployeeRegisterPage from './pages/EmployeeRegisterPage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CompanyPage from './pages/CompanyPage.tsx';
import StudentDetailPage from './pages/StudentDetailPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import LineCallbackPage from './pages/LineCallbackPage.tsx';
import PublicCompanyProfilePage from './pages/PublicCompanyProfilePage.tsx';
import ChangePasswordPage from './pages/ChangePasswordPage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/ResetPasswordPage.tsx';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
    { path: '/', element: <MainLayout><App /></MainLayout> },
    { path: '/about', element: <MainLayout><AboutPage /></MainLayout> },
    { path: '/auth/employee/login', element: <EmployeeLoginPage /> },
    { path: '/auth/employee/register', element: <EmployeeRegisterPage /> },
    { path: '/students/:studentId', element: <MainLayout><StudentDetailPage /></MainLayout> },
    { path: '/company/:companyId', element: <MainLayout><PublicCompanyProfilePage /></MainLayout> },
    { path: '/auth/line/callback', element: <LineCallbackPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    { path: '/reset-password/:token', element: <ResetPasswordPage /> },
    {
        path: '/profile',
        element: (
            <ProtectedRoute>
                <MainLayout><ProfilePage /></MainLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: '/company-profile',
        element: (
            <ProtectedRoute>
                <MainLayout><CompanyPage /></MainLayout>
            </ProtectedRoute>
        )
    },
    {
        path: '/change-password',
        element: (
            <ProtectedRoute>
                <MainLayout><ChangePasswordPage /></MainLayout>
            </ProtectedRoute>
        )
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId="531518656629-o4hn12es3j77skt19gstioifn4npefpa.apps.googleusercontent.com">
            <AuthProvider>
                <RouterProvider router={router} />
                <Toaster position="top-right" />
            </AuthProvider>
        </GoogleOAuthProvider>
    </StrictMode>
);