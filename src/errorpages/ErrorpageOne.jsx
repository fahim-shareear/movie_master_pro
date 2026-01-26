import React from 'react';
import '../App.css';
import Error from '../assets/404_error_page.png';
import { useNavigate } from 'react-router';

const ErrorpageOne = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="flex flex-col justify-center items-center h-screen error">
                <img src={Error} alt="404 Page Not found" className="w-200 h-200 rounded-full" />
                <button 
                    className="px-8 py-4 rounded-full font-bold text-white transition-all duration-300 
                               bg-linear-to-r from-brand-primary to-brand-secondary 
                               hover:from-brand-secondary hover:to-brand-primary 
                               hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20 cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default ErrorpageOne;