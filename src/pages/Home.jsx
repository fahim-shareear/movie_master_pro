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
                // We add a timestamp or clear cache logic if needed, 
                // but usually, a fresh GET request handles this.
                const response = await axiosInstance.get('/movies');
                setMovies(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                toast.error('Failed to load home content');
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    // --- UPDATED REQUIREMENT LOGIC ---
    
    // 1. Hero: Show the 4 latest movies in the carousel
    const heroMovies = [...movies].reverse().slice(0, 4); 

    // 2. Top Rated: Highest 5 ratings
    const topRatedMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5); 

    // 3. Recently Added: STRICTLY the latest 6 movies added to the DB
    // We sort by _id (which contains a timestamp in MongoDB) or a createdAt field
    const recentMovies = [...movies]
        .sort((a, b) => b._id.localeCompare(a._id)) // Sorts by newest first
        .slice(0, 6); 
    
    // 4. Genre Data (Static)
    const staticGenres = ["Action", "Sci-Fi", "Drama", "Comedy", "Horror", "Thriller", "Adventure", "Animation"];

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-[#0F172A] flex items-center justify-center">
                <motion.div
                    className="w-16 h-16 border-4 border-[#4F46E5] border-t-[#EAB308] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans">
            
            {/* --- 1. HERO SECTION (Dynamic Carousel) --- */}
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
                                <img src={movie.posterUrl} className="w-full h-full object-cover" alt={movie.title} />
                                <div className="absolute inset-0 bg-linear-to-r from-[#0F172A] via-[#0F172A]/70 to-transparent flex items-center px-6 md:px-20">
                                    <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} className="max-w-2xl">
                                        <h1 className="text-5xl md:text-7xl font-black italic uppercase mb-4 text-white tracking-tighter">
                                            {movie.title}
                                        </h1>
                                        <p className="text-white/70 text-lg line-clamp-3 mb-8">{movie.plotSummary}</p>
                                        <button 
                                            onClick={() => navigate(`/movie/${movie._id}`)}
                                            className="bg-linear-to-r from-[#4F46E5] to-[#7C3AED] px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20 cursor-pointer"
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
            <section className="bg-[#1E293B] border-y border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <HiOutlineFilm className="mx-auto text-[#EAB308] text-4xl mb-2" />
                        <h3 className="text-3xl font-black italic">{movies.length}</h3>
                        <p className="text-white/40 text-xs uppercase tracking-widest">Total Movies</p>
                    </div>
                    <div className="text-center">
                        <HiOutlineUserGroup className="mx-auto text-[#EAB308] text-4xl mb-2" />
                        <h3 className="text-3xl font-black italic">1,240</h3>
                        <p className="text-white/40 text-xs uppercase tracking-widest">Active Users</p>
                    </div>
                    <div className="text-center">
                        <div className="text-[#EAB308] text-4xl mb-2 font-black">24/7</div>
                        <h3 className="text-3xl font-black italic">Support</h3>
                        <p className="text-white/40 text-xs uppercase tracking-widest">Global Service</p>
                    </div>
                    <div className="text-center">
                        <HiOutlineStar className="mx-auto text-[#EAB308] text-4xl mb-2" />
                        <h3 className="text-3xl font-black italic">4.9</h3>
                        <p className="text-white/40 text-xs uppercase tracking-widest">User Rating</p>
                    </div>
                </div>
            </section>

            {/* --- 3. TOP RATED MOVIES --- */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-black text-[#EAB308] italic mb-10 border-l-4 border-[#EAB308] pl-4 uppercase">Top Rated Masterpieces</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {topRatedMovies.map((movie) => (
                        <motion.div 
                            key={movie._id} whileHover={{ y: -10 }}
                            className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 group flex flex-col h-full"
                        >
                            <div className="relative overflow-hidden cursor-pointer" onClick={() => navigate(`/movie/${movie._id}`)}>
                                <img src={movie.posterUrl} className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[#EAB308] text-xs font-black">
                                    ★ {movie.rating}
                                </div>
                            </div>
                            <div className="p-4 text-center flex flex-col grow justify-between">
                                <h4 className="font-bold truncate text-sm mb-3 group-hover:text-[#EAB308] transition-colors">{movie.title}</h4>
                                <button 
                                    onClick={() => navigate(`/movie/${movie._id}`)}
                                    className="w-full bg-[#4F46E5]/20 hover:bg-[#4F46E5] border border-[#4F46E5]/40 text-[#4F46E5] hover:text-white font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    View Details <HiOutlineArrowRight className="text-[10px]" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- 4. RECENTLY ADDED (Synced with DB) --- */}
            <section className="bg-white/5 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-black text-white italic mb-12 border-l-4 border-[#4F46E5] pl-4 uppercase tracking-tighter">Recently Added</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentMovies.map((movie) => (
                            <motion.div 
                                key={movie._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                className="bg-[#1E293B] p-4 rounded-3xl flex gap-5 border border-white/5 hover:border-[#4F46E5]/50 transition-all group cursor-pointer"
                                onClick={() => navigate(`/movie/${movie._id}`)}
                            >
                                <img src={movie.posterUrl} className="w-24 h-32 object-cover rounded-xl shadow-lg" />
                                <div className="flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-black text-lg group-hover:text-[#EAB308] transition-colors line-clamp-1">{movie.title}</h3>
                                        <p className="text-white/40 text-xs uppercase mt-1 tracking-widest">{movie.genre} • {movie.releaseYear}</p>
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
                <h2 className="text-center text-4xl font-black italic mb-16 tracking-widest">EXPLORE BY <span className="text-[#EAB308]">GENRE</span></h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {staticGenres.map((g) => (
                        <motion.div 
                            key={g} whileHover={{ scale: 1.05, backgroundColor: '#4F46E5' }}
                            className="bg-white/5 border border-white/10 py-8 text-center rounded-2xl cursor-pointer font-black tracking-widest uppercase text-sm"
                        >
                            {g}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- 6. ABOUT PLATFORM --- */}
            <section className="bg-linear-to-t from-black to-transparent py-24 border-t border-white/5">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-black italic text-[#EAB308] mb-8 uppercase">Movie Master Pro</h2>
                    <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
                        MovieMaster Pro is a cinematic ecosystem designed for enthusiasts who demand a professional edge. 
                        We combine real-time database management with a high-fidelity user interface, allowing you to curate, 
                        explore, and celebrate the world of cinema without boundaries.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;