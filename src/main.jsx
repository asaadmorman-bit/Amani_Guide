import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserHomepage from './pages/UserHomepage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserHomepage />,
  },
  {
    path: "/homepage",
    element: <UserHomepage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);