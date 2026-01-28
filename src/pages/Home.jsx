import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlineArrowRight, HiOutlineStar, HiOutlineUserGroup, HiOutlineFilm } from 'react-icons/hi';
import useAxios from '../hooks/useAxios';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axiosInstance.get('/movies');
                // Ensure movies are available before setting state
                setMovies(response.data || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                toast.error('Failed to load home content');
                setLoading(false);
            }
        };
        fetchMovies();
    }, [axiosInstance]);

    
    // 1. Hero: Show 4 most recent movies in the slider
    const heroMovies = [...movies]
        .sort((a, b) => new Date(b.addedAt || b._id) - new Date(a.addedAt || a._id))
        .slice(0, 4); 

    // 2. Top Rated: Remains sorted by rating
    const topRatedMovies = [...movies]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5); 

    // 3. FIXED: Recently Added (Sorts by date and takes the latest 6)
    const recentMovies = [...movies]
        .sort((a, b) => new Date(b.addedAt || b._id) - new Date(a.addedAt || a._id))
        .slice(0, 6); 

    const staticGenres = ["Action", "Sci-Fi", "Drama", "Comedy", "Horror", "Thriller", "Adventure", "Animation"];

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-white dark:bg-[#0F172A] flex items-center justify-center">
                <motion.div
                    className="w-16 h-16 border-4 border-[#4F46E5] border-t-[#EAB308] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white font-sans transition-colors duration-300">
            
            {/* --- 1. HERO SECTION --- */}
            <section className="h-[80vh] w-full">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 5000 }}
                    pagination={{ clickable: true }}
                    className="h-full"
                >
                    {heroMovies.map((movie) => (
                        <SwiperSlide key={movie._id}>
                            <div className="relative h-full w-full">
                                <img src={movie.posterImg} className="w-full h-full object-cover" alt={movie.title} />
                                <div className="absolute inset-0 bg-linear-to-r from-white via-white/80 dark:from-[#0F172A] dark:via-[#0F172A]/70 to-transparent flex items-center px-6 md:px-20">
                                    <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} className="max-w-2xl">
                                        <h1 className="text-5xl md:text-7xl font-black italic uppercase mb-4 text-slate-900 dark:text-white tracking-tighter">
                                            {movie.title}
                                        </h1>
                                        <p className="text-slate-600 dark:text-white/70 text-lg line-clamp-3 mb-8">{movie.details || movie.plotSummary}</p>
                                        <button 
                                            onClick={() => navigate(`/movie/${movie._id}`)}
                                            className="bg-linear-to-r from-[#4F46E5] to-[#7C3AED] px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20 cursor-pointer text-white"
                                        >
                                            View Details <HiOutlineArrowRight />
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* --- 2. STATISTICS SECTION --- */}
            <section className="bg-slate-50 dark:bg-[#1E293B] border-y border-slate-200 dark:border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { icon: HiOutlineFilm, val: movies.length, label: "Total Movies" },
                        { icon: HiOutlineUserGroup, val: "1,240", label: "Active Users" },
                        { label: "Global Service", val: "Support", custom: "24/7" },
                        { icon: HiOutlineStar, val: "4.9", label: "User Rating" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            {stat.icon ? <stat.icon className="mx-auto text-[#EAB308] text-4xl mb-2" /> : <div className="text-[#EAB308] text-4xl mb-2 font-black">{stat.custom}</div>}
                            <h3 className="text-3xl font-black italic text-slate-900 dark:text-white">{stat.val}</h3>
                            <p className="text-slate-400 dark:text-white/40 text-xs uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- 3. TOP RATED MOVIES --- */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-black text-[#EAB308] italic mb-10 border-l-4 border-[#EAB308] pl-4 uppercase">Top Rated Masterpieces</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {topRatedMovies.map((movie) => (
                        <motion.div 
                            key={movie._id} whileHover={{ y: -10 }}
                            className="bg-slate-50 dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group flex flex-col h-full"
                        >
                            <div className="relative overflow-hidden cursor-pointer" onClick={() => navigate(`/movie/${movie._id}`)}>
                                <img src={movie.posterImg} className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[#EAB308] text-xs font-black">
                                    ★ {movie.rating}
                                </div>
                            </div>
                            <div className="p-4 text-center flex flex-col grow justify-between">
                                <h4 className="font-bold truncate text-sm mb-3 text-slate-900 dark:text-white group-hover:text-[#EAB308] transition-colors">{movie.title}</h4>
                                <button 
                                    onClick={() => navigate(`/movie/${movie._id}`)}
                                    className="w-full bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 hover:bg-[#4F46E5] border border-[#4F46E5]/40 text-[#4F46E5] hover:text-white font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    View Details <HiOutlineArrowRight className="text-[10px]" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- 4. RECENTLY ADDED --- */}
            <section className="bg-slate-50/50 dark:bg-white/5 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white italic mb-12 border-l-4 border-[#4F46E5] pl-4 uppercase tracking-tighter">Recently Added</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentMovies.map((movie) => (
                            <motion.div 
                                key={movie._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-[#1E293B] p-4 rounded-3xl flex gap-5 border border-slate-200 dark:border-white/5 hover:border-[#4F46E5]/50 transition-all group cursor-pointer shadow-sm dark:shadow-none"
                                onClick={() => navigate(`/movie/${movie._id}`)}
                            >
                                <img src={movie.posterImg} className="w-24 h-32 object-cover rounded-xl shadow-lg" alt={movie.title} />
                                <div className="flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-[#EAB308] transition-colors line-clamp-1">{movie.title}</h3>
                                        <p className="text-slate-400 dark:text-white/40 text-xs uppercase mt-1 tracking-widest">{movie.genre} • {movie.releaseDate?.split('-')[0] || 'N/A'}</p>
                                    </div>
                                    <button className="text-[#EAB308] text-[10px] font-black tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all cursor-pointer">
                                        View Details <HiOutlineArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 5. GENRE SECTION --- */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <h2 className="text-center text-4xl font-black italic mb-16 tracking-widest text-slate-900 dark:text-white">EXPLORE BY <span className="text-[#EAB308]">GENRE</span></h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {staticGenres.map((g) => (
                        <motion.div 
                            key={g} whileHover={{ scale: 1.05, backgroundColor: '#4F46E5', color: '#fff' }}
                            className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-8 text-center rounded-2xl cursor-pointer font-black tracking-widest uppercase text-sm text-slate-600 dark:text-white transition-colors"
                        >
                            {g}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- 6. ABOUT PLATFORM --- */}
            <section className="bg-linear-to-t from-slate-100 to-transparent dark:from-black dark:to-transparent py-24 border-t border-slate-200 dark:border-white/5">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-black italic text-[#EAB308] mb-8 uppercase">Movie Master Pro</h2>
                    <p className="text-slate-600 dark:text-white/60 text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
                        MovieMaster Pro is a cinematic ecosystem designed for enthusiasts who demand a professional edge. 
                        We combine real-time database management with a high-fidelity user interface, allowing you to curate, 
                        explore, and celebrate the world of cinema without boundaries.
                    </p>
                    <div className="flex flex-wrap justify-center gap-10 opacity-60">
                        <span className="font-black text-xl italic tracking-tighter text-slate-400 dark:text-white/30">ULTRA-HD</span>
                        <span className="font-black text-xl italic tracking-tighter text-slate-400 dark:text-white/30">DTS-AUDIO</span>
                        <span className="font-black text-xl italic tracking-tighter text-slate-400 dark:text-white/30">PRO-UI</span>
                        <span className="font-black text-xl italic tracking-tighter text-slate-400 dark:text-white/30">DB-CLUSTERS</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;