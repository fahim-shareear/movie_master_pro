import React, { useState, useEffect, use } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { 
    HiOutlineCalendar, HiOutlineStar, HiOutlineUser, HiOutlineTag, 
    HiOutlineTrash, HiOutlinePencilAlt, HiOutlineArrowLeft, HiOutlineBookmark
} from 'react-icons/hi'; // FIXED: Corrected import path
import { AuthContext } from '../providers/AuthContext';
import useAxios from '../hooks/useAxios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const { user } = use(AuthContext); 
    
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dynamic theme detection for SweetAlert2
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    useEffect(() => {
        let isMounted = true;
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/movies/${id}`);
                if (isMounted) {
                    setMovie(response.data);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.message || "Movie not found.");
                    setLoading(false);
                }
            }
        };
        if (id) fetchMovieDetails();
        return () => { isMounted = false; };
    }, [id, axiosInstance]);

    const handleAddToWatchlist = async () => {
        if (!user) return toast.error("Please login first!");

        try {
            const watchData = {
                movieId: id,
                movieTitle: movie.title,
                moviePoster: movie.posterImg,
                movieGenre: movie.genre
            };

            await axiosInstance.post('/watchlist', watchData);
            window.dispatchEvent(new Event('watchlistUpdated'));

            Swal.fire({
                title: "Added!",
                text: "Movie added to watchlist.",
                icon: "success",
                background: isDark ? "#1E293B" : "#fff", 
                color: isDark ? "#fff" : "#0F172A", 
                confirmButtonColor: "#EAB308"
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Already in watchlist");
        }
    };

    const handleDelete = () => {
        Swal.fire({
            title: "Delete permanently?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete!",
            background: isDark ? "#1E293B" : "#fff", 
            color: isDark ? "#fff" : "#0F172A"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/movies/${id}`);
                    toast.success("Movie deleted");
                    navigate('/allmovie');
                } catch (error) { toast.error(error.message || "Failed to delete"); }
            }
        });
    };

    if (loading) return (
        <div className="h-screen bg-white dark:bg-[#0F172A] flex items-center justify-center text-slate-900 dark:text-white italic tracking-widest uppercase transition-colors duration-300">
            Loading...
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white py-20 px-4 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-slate-400 dark:text-white/40 hover:text-[#EAB308] transition-colors mb-8 uppercase text-[10px] font-bold tracking-widest"
                >
                    <HiOutlineArrowLeft /> Back to Movies
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full lg:w-1/3 relative">
                        <img 
                            src={movie.posterImg} 
                            alt={movie.title} 
                            className="w-full rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10" 
                        />
                        <div className="absolute top-4 right-4 bg-[#EAB308] text-black font-black px-4 py-2 rounded-xl flex items-center gap-1 shadow-xl text-xs">
                            <HiOutlineStar /> {movie.rating}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-2/3">
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase mb-6 tracking-tighter leading-none text-slate-900 dark:text-white">
                            {movie.title}
                        </h1>
                        
                        <div className="flex flex-wrap gap-6 mb-8 text-slate-500 dark:text-white/50 font-bold uppercase text-[10px] tracking-widest">
                            <span className="flex items-center gap-2"><HiOutlineTag className="text-[#EAB308]"/> {movie.genre}</span>
                            <span className="flex items-center gap-2"><HiOutlineCalendar className="text-[#EAB308]"/> {movie.releaseDate}</span>
                            <span className="flex items-center gap-2"><HiOutlineUser className="text-[#EAB308]"/> By {movie.addedBy}</span>
                        </div>

                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-3xl mb-10 backdrop-blur-sm shadow-sm dark:shadow-none">
                            <h3 className="text-[#EAB308] font-black italic uppercase mb-4 tracking-widest text-xs">The Synopsis</h3>
                            <p className="text-slate-600 dark:text-white/70 leading-relaxed text-lg italic font-light">
                                {movie.plotSummary || "No plot description available for this cinematic masterpiece."}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={handleAddToWatchlist} 
                                className="w-full lg:w-max px-10 bg-[#EAB308] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase tracking-widest text-xs shadow-xl shadow-[#EAB308]/20"
                            >
                                <HiOutlineBookmark className="text-xl" /> Add to Watchlist
                            </button>

                            {user?.uid === movie?.uid && (
                                <div className="flex flex-wrap gap-4 border-t border-slate-200 dark:border-white/10 pt-8 mt-4">
                                    <button 
                                        onClick={() => navigate(`/update-movie/${id}`)} 
                                        className="flex-1 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white font-black py-4 rounded-2xl hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase text-xs tracking-widest"
                                    >
                                        <HiOutlinePencilAlt className="inline mr-2" /> Update
                                    </button>
                                    <button 
                                        onClick={handleDelete} 
                                        className="flex-1 bg-red-600/10 border border-red-600/30 text-red-500 font-black py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all uppercase text-xs tracking-widest"
                                    >
                                        <HiOutlineTrash className="inline mr-2" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;