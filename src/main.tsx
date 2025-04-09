// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import GlobalLoader from './shared/components/GlobalLoader';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalLoader />
    <RouterProvider router={router} />
  </React.StrictMode>
);
