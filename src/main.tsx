// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import GlobalLoader from './shared/components/GlobalLoader';
import { GlobalDialogProvider } from './shared/context/DialogContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalDialogProvider>
      <GlobalLoader />
      <RouterProvider router={router} />
    </GlobalDialogProvider>
  </React.StrictMode>
);
