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

const router = createBrowserRouter([
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
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();