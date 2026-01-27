import React, { useState, useEffect, use } from 'react';
import { Link, useNavigate, NavLink } from 'react-router'; 
import { HiMenuAlt2, HiOutlineX, HiOutlineSearch } from 'react-icons/hi';
import { MdOutlineWatchLater } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../providers/AuthContext';
import useAxios from '../hooks/useAxios';
import Logo from '../assets/logo.png';

const Navbar = () => {
    const { user, signOutUser } = use(AuthContext);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [watchlistCount, setWatchlistCount] = useState(0); 
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    // Logic to fetch and listen for watchlist updates
    useEffect(() => {
        const fetchCount = () => {
            if (user) {
                axiosInstance.get('/watchlist')
                    .then(res => setWatchlistCount(res.data.length))
                    .catch(err => console.error("Watchlist count error", err));
            } else {
                setWatchlistCount(0);
            }
        };

        fetchCount();

        // Listen for the signal from Watchlist or MovieDetails pages
        window.addEventListener('watchlistUpdated', fetchCount);
        
        return () => window.removeEventListener('watchlistUpdated', fetchCount);
    }, [user, axiosInstance]);

    const handleLogout = async () => {
        try {
            await signOutUser();
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // 1. PUBLIC ROUTES (Always visible)
    const publicItems = [
        { name: 'Home', path: '/' },
        { name: 'All Movies', path: '/allmovie' },
    ];

    // 2. PRIVATE ROUTES (Visible ONLY when user is logged in)
    const privateItems = [
        { name: 'Add Movie', path: '/movies/add' },
        { name: 'My Collection', path: '/movies/my-collection' },
        { name: 'My Watchlist', path: '/movies/watchlist' },
    ];

    const sidebarVariants = {
        closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
        opened: { 
            x: 0, 
            transition: { 
                type: 'spring', 
                stiffness: 300, 
                damping: 30, 
                staggerChildren: 0.08, 
                delayChildren: 0.2 
            } 
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: -20 },
        opened: { opacity: 1, x: 0 }
    };

    return (
        /* Brand Background: Deep Midnight (#0F172A) */
        <nav className="bg-[#0F172A] text-white sticky top-0 z-50 shadow-2xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
                
                {/* --- LEFT: Hamburger & Brand --- */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="text-3xl cursor-pointer hover:text-[#EAB308] transition-colors"
                    >
                        <HiMenuAlt2 />
                    </button>
                    
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-linear-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                            <img src={Logo} alt="logo" />
                        </div>
                        <h1 className="hidden lg:block font-black text-2xl tracking-tighter uppercase italic">
                            Movie<span className="text-[#EAB308]">Master</span> PRO
                        </h1>
                    </Link>
                </div>

                {/* --- CENTER: Global Search --- */}
                <form onSubmit={(e) => { e.preventDefault(); navigate(`/search?q=${e.target.search.value}`); }} className="flex-1 max-w-lg relative hidden md:block">
                    <input 
                        name="search"
                        type="text" 
                        placeholder="Search movies..." 
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-12 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-sm"
                    />
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EAB308] text-xl" />
                </form>

                {/* --- RIGHT: Watchlist & Auth --- */}
                <div className="flex items-center gap-4">
                    {/* Private Icon: Watchlist link with indicator badge */}
                    {user && (
                        <NavLink 
                            to="/movies/watchlist" 
                            className={({isActive}) => isActive ? "relative text-[#EAB308] text-2xl" : "relative text-2xl hover:text-[#EAB308]"}
                        >
                            <MdOutlineWatchLater />
                            {watchlistCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0F172A]">
                                    {watchlistCount}
                                </span>
                            )}
                        </NavLink>
                    )}

                    {user ? (
                        /* Logged In State */
                        <div className="relative">
                            <motion.img 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                                src={user?.photoURL || 'https://via.placeholder.com/40'} 
                                className="w-10 h-10 rounded-full border-2 border-[#EAB308] cursor-pointer object-cover"
                            />
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                                        className="absolute right-0 mt-4 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden"
                                    >
                                        <div className="p-4 bg-slate-50 border-b flex items-center gap-3">
                                            <img src={user?.photoURL || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full border border-[#4F46E5] object-cover" alt="User profile" onError={(e) => e.target.src = 'https://via.placeholder.com/40'} />
                                            <div className="overflow-hidden">
                                                <p className="font-bold truncate text-xs">{user?.displayName || 'User'}</p>
                                                <button onClick={handleLogout} className="text-[10px] text-red-600 font-bold hover:underline">Sign Out</button>
                                            </div>
                                        </div>
                                        <Link to="/profile" className="block p-3 hover:bg-slate-100 text-sm font-semibold text-center border-t">Profile</Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* Logged Out State */
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="font-bold text-sm hover:text-[#EAB308]">Login</Link>
                            <Link to="/register" className="bg-linear-to-r from-[#4F46E5] to-[#7C3AED] px-5 py-2 rounded-full font-bold text-sm">Join</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* --- SIDEBAR DRAWER --- */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60" />
                        <motion.div 
                            variants={sidebarVariants} initial="closed" animate="opened" exit="closed"
                            className="fixed top-0 left-0 h-screen w-80 bg-[#0F172A] z-70 p-8 shadow-2xl border-r border-white/5"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-[#EAB308] font-black text-xl italic">NAVIGATION</h2>
                                <HiOutlineX className="text-3xl cursor-pointer hover:text-red-500" onClick={() => setSidebarOpen(false)} />
                            </div>

                            <div className="flex flex-col gap-5">
                                {/* Always show Public Items */}
                                {publicItems.map((item) => (
                                    <motion.div key={item.name} variants={itemVariants}>
                                        <NavLink 
                                            to={item.path} onClick={() => setSidebarOpen(false)}
                                            className={({isActive}) => `text-xl font-bold transition-all ${isActive ? 'text-[#EAB308] pl-2' : 'hover:text-[#4F46E5] hover:pl-2'}`}
                                        >
                                            {item.name}
                                        </NavLink>
                                    </motion.div>
                                ))}

                                {/* ONLY show Private Items if user exists */}
                                {user && privateItems.map((item) => (
                                    <motion.div key={item.name} variants={itemVariants}>
                                        <NavLink 
                                            to={item.path} onClick={() => setSidebarOpen(false)}
                                            className={({isActive}) => `text-xl font-bold transition-all ${isActive ? 'text-[#EAB308] pl-2' : 'hover:text-[#4F46E5] hover:pl-2'}`}
                                        >
                                            {item.name}
                                        </NavLink>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;