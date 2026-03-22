'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            padding: '16px',
          },
          success: {
            style: {
              background: '#d1fae5',
              color: '#065f46',
            },
            icon: '✓',
          },
          error: {
            style: {
              background: '#fee2e2',
              color: '#991b1b',
            },
            icon: '✕',
          },
        }}
      />
    </SessionProvider>
  );
}
