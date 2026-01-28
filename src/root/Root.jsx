import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import Footer from '../components/Footer';

const Root = () => {
    return (
        /* FIX: Added min-h-screen to ensure the background covers the full page.
           Added bg-white dark:bg-slate-900 to handle the theme color shift.
           Added transition-colors to make the change feel smooth.
        */
        <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Toaster 
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0F172A',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
              },
              success: {
                style: {
                  borderColor: '#10b981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                },
              },
              error: {
                style: {
                  borderColor: '#ef4444',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#fca5a5',
                },
              },
            }}
          />
          <Navbar />
          {/* Wrapping Outlet in a container ensures consistent padding 
             and theme behavior for all routed pages 
          */}
          <div className="min-h-[calc(100vh-80px)]"> 
             <Outlet />
          </div>
          <Footer />
          <ToastContainer />
        </div>
    );
};

export default Root;