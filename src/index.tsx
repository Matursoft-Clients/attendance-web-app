import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/panel/DashboardPage';
import AppLayout from './layouts/AppLayout';
import CommonProductPage from './pages/panel/CommonProductPage';
import CommonProductHistoryPage from './pages/panel/CommonProductHistoryPage';
import CommonProductHistoryDetailPage from './pages/panel/CommonProductHistoryDetailPage';
import SpecialProductPage from './pages/panel/SpecialProductPage';
import SpecialProductHistoryPage from './pages/panel/SpecialProductHistoryPage';
import SpecialProductHistoryDetailPage from './pages/panel/SpecialProductHistoryDetailPage';
import ProfilePage from './pages/panel/ProfilePage';
import AnnouncementsPage from './pages/panel/AnnouncementsPage';
import BannersPage from './pages/panel/BanersPage';
import CustomAttendanceLocationsPage from './pages/panel/CustomAttendanceLocationsPage';
import SettingsPage from './pages/panel/SettingsPage';
import JobsPage from './pages/panel/JobsPage';
import EmployeesPage from './pages/panel/EmployeesPage';
import DailyAttendancesPage from './pages/panel/DailyAttendancesPage';
import HomePage from './pages/HomePage';
import BranchsPage from './pages/panel/BranchsPage';
import { ModalsProvider } from '@mantine/modals';

const router = createBrowserRouter([
    {
        path: "/",
        children: [
            {
                path: '',
                element: <HomePage />
            }
        ]
    },
    {
        path: "login",
        element: <LoginPage />,
    },
    {
        path: "panel",
        element: <AppLayout />,
        children: [
            {
                path: "dashboard",
                element: <DashboardPage />,
            },
            {
                path: "announcements",
                children: [
                    {
                        path: '',
                        element: <AnnouncementsPage />
                    }
                ]
            },
            {
                path: "banners",
                children: [
                    {
                        path: '',
                        element: <BannersPage />
                    }
                ]
            },
            {
                path: 'custom-attendance-locations',
                children: [
                    {
                        path: '',
                        element: <CustomAttendanceLocationsPage />
                    }
                ]
            },
            {
                path: 'settings',
                children: [
                    {
                        path: '',
                        element: <SettingsPage />
                    }
                ]
            },
            {
                path: 'jobs',
                children: [
                    {
                        path: '',
                        element: <JobsPage />
                    }
                ]
            },
            {
                path: 'employees',
                children: [
                    {
                        path: '',
                        element: <EmployeesPage />
                    }
                ]
            },
            {
                path: 'branchs',
                children: [
                    {
                        path: '',
                        element: <BranchsPage />
                    }
                ]
            },
            {
                path: 'daily-attendances',
                children: [
                    {
                        path: '',
                        element: <DailyAttendancesPage />
                    }
                ]
            },
            {
                path: "common-product",
                element: <CommonProductPage />
            },
            {
                path: "common-product-history",
                element: <CommonProductHistoryPage />
            },
            {
                path: "common-product-history-detail",
                element: <CommonProductHistoryDetailPage />
            },
            {
                path: "special-product",
                element: <SpecialProductPage />
            },
            {
                path: "special-product-history",
                element: <SpecialProductHistoryPage />
            },
            {
                path: "special-product-history-detail",
                element: <SpecialProductHistoryDetailPage />
            },
            {
                path: "profile",
                element: <ProfilePage />
            }
        ],
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ModalsProvider>
            <RouterProvider router={router} />
        </ModalsProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
