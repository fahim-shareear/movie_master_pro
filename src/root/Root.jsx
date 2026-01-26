import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';

const Root = () => {
    return (
        <div>
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
          <Navbar></Navbar>
          <Outlet></Outlet>
          <ToastContainer />
        </div>
    );
};

export default Root;