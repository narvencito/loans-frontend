// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './router';
import './index.css';
import { DialogProvider } from './shared/context/DialogContext';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DialogProvider>
      <RouterProvider router={router} />
    </DialogProvider>
  </React.StrictMode>
);
