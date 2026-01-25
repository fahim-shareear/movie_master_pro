import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.05); opacity: 0.8; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-logo { animation: pulse 3s infinite ease-in-out; }
            .rotate-reel { transform-origin: center; animation: spin 10s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}
        </style>
        {/* Film Reel Backdrop */}
        <circle cx="50" cy="50" r="45" stroke="#EAB308" strokeWidth="2" className="rotate-reel" strokeDasharray="10 5" />
        {/* The 'M' Shape */}
        <path 
          d="M25 70V30L50 50L75 30V70" 
          stroke="url(#grad)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-logo"
        />
        {/* Play Button Center */}
        <polygon points="45,45 60,50 45,55" fill="#EAB308" />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-xl font-bold tracking-tighter">
        Movie<span className="text-yellow-500">Master</span>
      </span>
    </div>
  );
};

export default Logo;