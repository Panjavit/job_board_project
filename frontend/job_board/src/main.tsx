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

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <MainLayout>
                <App />
            </MainLayout>
        ),
    },
    {
        path: '/profile',
        element: (
            <MainLayout>
                <ProfilePage />
            </MainLayout>
        ),
    },
    {
        path: '/company-profile',
        element: (
            <MainLayout>
                <CompanyPage />
            </MainLayout>
        )
    },
    {
        path: '/about',
        element: (
            <MainLayout>
                <AboutPage />
            </MainLayout>
        ),
    },
    {
        path: '/auth/employee/login',
        element: <EmployeeLoginPage />,
    },
    {
        path: '/auth/employee/register',
        element: <EmployeeRegisterPage />,
    },
    {
        path: '/students/:studentId', //ใช้studentIdเป็นพารามิเตอร์
        element: (
            <MainLayout>
                <StudentDetailPage />
            </MainLayout>
        ),
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId="531518656629-o4hn12es3j77skt19gstioifn4npefpa.apps.googleusercontent.com">
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </GoogleOAuthProvider>
    </StrictMode>
);
