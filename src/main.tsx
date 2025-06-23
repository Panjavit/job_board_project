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
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
