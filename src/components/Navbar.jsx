import React, { useState, useEffect, use } from 'react';
import { Link, useNavigate, NavLink } from 'react-router'; 
import { HiMenuAlt2, HiOutlineX, HiOutlineSearch, HiOutlineAdjustments, HiOutlinePlay } from 'react-icons/hi';
import { MdOutlineWatchLater } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../providers/AuthContext';
import useAxios from '../hooks/useAxios';
import Logo from '../assets/logo.png';
import useTheme from '../hooks/useTheme';

const Navbar = () => {
    const { user, signOutUser } = use(AuthContext);
    const { theme, toggleTheme } = useTheme();
    
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [watchlistCount, setWatchlistCount] = useState(0); 
    // Search & Filter States
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const genresList = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Thriller"];

    // Watchlist Logic
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
        window.addEventListener('watchlistUpdated', fetchCount);
        return () => window.removeEventListener('watchlistUpdated', fetchCount);
    }, [user, axiosInstance]);

    // Instant Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim().length > 1) {
                setIsSearching(true);
                axiosInstance.get(`/movies/search?q=${searchTerm}&genres=${selectedGenres.join(',')}&minRating=${minRating}`)
                    .then(res => {
                        setSearchResults(res.data);
                        setIsSearching(false);
                    })
                    .catch(() => setIsSearching(false));
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedGenres, minRating, axiosInstance]);

    const handleLogout = async () => {
        try {
            await signOutUser();
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/allmovie?q=${searchTerm}&genres=${selectedGenres.join(',')}&minRating=${minRating}`);
        setSearchTerm("");
        setSearchResults([]);
    };

    const toggleGenre = (genre) => {
        setSelectedGenres(prev => 
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
    };

    const publicItems = [
        { name: 'Home', path: '/' },
        { name: 'All Movies', path: '/allmovie' },
    ];

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
                type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.08, delayChildren: 0.2 
            } 
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: -20 },
        opened: { opacity: 1, x: 0 }
    };

    return (
        /* CHANGED: Added bg-white and dark:bg-[#0F172A] so the background actually switches */
        <nav className="bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white sticky top-0 z-50 shadow-2xl border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
                
                {/* LEFT: Sidebar Toggle & Brand */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="text-3xl cursor-pointer hover:text-[#EAB308] transition-colors"
                    >
                        <HiMenuAlt2 />
                    </button>
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-linear-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                            <img src={Logo} alt="logo" className="rounded-xl" />
                        </div>
                        <h1 className="hidden lg:block font-black text-2xl tracking-tighter uppercase italic">
                            Movie<span className="text-[#EAB308]">Master</span> PRO
                        </h1>
                    </Link>
                </div>

                {/* CENTER: Search + Results Modal */}
                <div className="flex-1 max-w-lg relative hidden md:block">
                    <form onSubmit={handleSearchSubmit} className="relative z-50">
                        <input 
                            name="search"
                            type="text" 
                            autoComplete="off"
                            placeholder="Search title or genre..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            /* CHANGED: Input background reacts to theme */
                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-2.5 px-12 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-sm text-slate-900 dark:text-white"
                        />
                        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EAB308] text-xl" />
                        <button 
                            type="button" 
                            onClick={() => setIsFilterOpen(!isFilterOpen)} 
                            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isFilterOpen ? 'text-[#EAB308]' : 'text-slate-400 dark:text-white/40 hover:text-[#4F46E5] dark:hover:text-white'}`}
                        >
                            <HiOutlineAdjustments size={20} />
                        </button>
                    </form>

                    {/* Instant Search Results Dropdown */}
                    <AnimatePresence>
                        {searchTerm.length > 1 && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                                /* CHANGED: Dropdown background reacts to theme */
                                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-40 max-h-100 overflow-y-auto"
                            >
                                {isSearching ? (
                                    <div className="p-6 text-center text-slate-400 dark:text-white/40 text-[10px] font-black uppercase tracking-widest">Searching...</div>
                                ) : searchResults.length > 0 ? (
                                    <div className="p-2">
                                        {searchResults.map((movie) => (
                                            <Link 
                                                key={movie._id} 
                                                to={`/movie/${movie._id}`} 
                                                onClick={() => {setSearchTerm(""); setSearchResults([]);}} 
                                                className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-colors group"
                                            >
                                                <img src={movie.posterImg || movie.posterUrl} className="w-10 h-14 object-cover rounded-lg shadow-md" alt="" />
                                                <div className="flex-1 text-left">
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#EAB308] transition-colors">{movie.title}</h4>
                                                    <p className="text-[10px] text-slate-400 dark:text-white/40 uppercase font-black">{movie.genre}</p>
                                                </div>
                                                <HiOutlinePlay className="text-slate-300 dark:text-white/20 group-hover:text-[#EAB308]" />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-slate-400 dark:text-white/40 text-[10px] font-black uppercase tracking-widest">No movies found</div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Filter UI */}
                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full mt-4 w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 p-6 rounded-3xl shadow-2xl z-30">
                                <p className="text-[10px] font-black text-[#EAB308] uppercase tracking-widest mb-3">Genres ($in)</p>
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {genresList.map(g => (
                                        <button key={g} type="button" onClick={() => toggleGenre(g)} className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase transition-all ${selectedGenres.includes(g) ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 border text-slate-600 dark:text-white'}`}>{g}</button>
                                    ))}
                                </div>
                                <p className="text-[10px] font-black text-[#EAB308] uppercase tracking-widest mb-3">Min Rating: {minRating}</p>
                                <input type="range" min="0" max="10" step="0.5" value={minRating} onChange={(e) => setMinRating(e.target.value)} className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#EAB308]" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* RIGHT: Watchlist & Auth */}
                <div className="flex items-center gap-4">
                    
                    {/* THEME TOGGLE */}
                    <input
                        type="checkbox"
                        className="toggle toggle-warning toggle-sm"
                        checked={theme === "dark"}
                        onChange={(e) => toggleTheme(e.target.checked)}
                    />

                    {user && (
                        <NavLink to="/movies/watchlist" className={({isActive}) => isActive ? "relative text-[#EAB308] text-2xl" : "relative text-2xl hover:text-[#EAB308]"}>
                            <MdOutlineWatchLater />
                            {watchlistCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0F172A]">
                                    {watchlistCount}
                                </span>
                            )}
                        </NavLink>
                    )}

                    {user ? (
                        <div className="relative">
                            <motion.img whileTap={{ scale: 0.9 }} referrerPolicy='no-referrer' onClick={() => setUserMenuOpen(!isUserMenuOpen)} src={`${user.photoURL}`} className="w-10 h-10 rounded-full border-2 border-[#EAB308] cursor-pointer object-cover" />
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="absolute right-0 mt-4 w-64 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-2xl overflow-hidden border dark:border-white/10">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b dark:border-white/10 flex items-center gap-3 text-left">
                                            <img src={user?.photoURL || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full border border-[#4F46E5] object-cover" alt="" />
                                            <div>
                                                <p className="font-bold truncate text-xs">{user?.displayName || 'User'}</p>
                                                <button onClick={handleLogout} className="text-[10px] text-red-600 font-bold hover:underline">Sign Out</button>
                                            </div>
                                        </div>
                                        <Link to="/profile" className="block p-3 hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-center border-t dark:border-white/10">Profile</Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="font-bold text-sm hover:text-[#EAB308]">Login</Link>
                            <Link to="/register" className="bg-linear-to-r from-[#4F46E5] to-[#7C3AED] px-5 py-2 rounded-full font-bold text-sm text-white">Join</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* SIDEBAR */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60" />
                        /* CHANGED: Sidebar background reacts to theme */
                        <motion.div variants={sidebarVariants} initial="closed" animate="opened" exit="closed" className="fixed top-0 left-0 h-screen w-80 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white z-70 p-8 shadow-2xl border-r border-slate-200 dark:border-white/5">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-[#EAB308] font-black text-xl italic uppercase">Navigation</h2>
                                <HiOutlineX className="text-3xl cursor-pointer hover:text-red-500" onClick={() => setSidebarOpen(false)} />
                            </div>
                            <div className="flex flex-col gap-5 text-left">
                                {publicItems.map((item) => (
                                    <motion.div key={item.name} variants={itemVariants}>
                                        <NavLink to={item.path} onClick={() => setSidebarOpen(false)} className={({isActive}) => `text-xl font-bold transition-all ${isActive ? 'text-[#EAB308] pl-2' : 'hover:text-[#4F46E5] hover:pl-2'}`}>
                                            {item.name}
                                        </NavLink>
                                    </motion.div>
                                ))}
                                {user && privateItems.map((item) => (
                                    <motion.div key={item.name} variants={itemVariants}>
                                        <NavLink to={item.path} onClick={() => setSidebarOpen(false)} className={({isActive}) => `text-xl font-bold transition-all ${isActive ? 'text-[#EAB308] pl-2' : 'hover:text-[#4F46E5] hover:pl-2'}`}>
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