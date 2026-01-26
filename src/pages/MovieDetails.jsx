import React, { useState, useEffect, use } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { 
    HiOutlineCalendar, HiOutlineStar, HiOutlineUser, HiOutlineTag, 
    HiOutlineTrash, HiOutlinePencilAlt, HiOutlineArrowLeft 
} from 'react-icons/hi';
import { AuthContext } from '../providers/AuthContext';
import useAxios from '../hooks/useAxios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    
    // user might be null if not logged in; that's fine for public viewing!
    const { user } = use(AuthContext); 
    
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchMovieDetails = async () => {
            try {
                // Ensure we don't trigger the loading state if we already have data
                setLoading(true);
                const response = await axiosInstance.get(`/movies/${id}`);
                
                if (isMounted) {
                    setMovie(response.data);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Fetch error:", error);
                    toast.error("Movie not found or server is down.");
                    setLoading(false);
                }
            }
        };

        if (id) fetchMovieDetails();

        return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Removed axiosInstance from dependencies to prevent re-fetch loops

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#4F46E5",
            confirmButtonText: "Yes, delete it!",
            background: "#1E293B",
            color: "#fff"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/movies/${id}`);
                    toast.success("Movie deleted successfully");
                    navigate('/allmovie');
                } catch (error) {
                    toast.error(error.message || "Failed to delete movie");
                }
            }
        });
    };

    if (loading) return (
        <div className="h-screen bg-[#0F172A] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-[#EAB308] border-t-transparent rounded-full" />
        </div>
    );

    if (!movie) return (
        <div className="h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
            <button onClick={() => navigate('/allmovie')} className="text-[#EAB308] underline">Back to collection</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0F172A] text-white py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back Link */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-[#EAB308] transition-colors mb-8 uppercase text-xs font-bold tracking-[0.2em] cursor-pointer">
                    <HiOutlineArrowLeft /> Back to Movies
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Poster */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full lg:w-1/3">
                        <div className="relative group">
                            <img src={movie.posterImg || movie.posterUrl} alt={movie.title} className="w-full rounded-3xl shadow-2xl border border-white/10 transition-transform duration-500 group-hover:scale-[1.02]" />
                            <div className="absolute top-4 right-4 bg-[#EAB308] text-black font-black px-4 py-2 rounded-xl flex items-center gap-1 shadow-xl">
                                <HiOutlineStar /> {movie.rating}
                            </div>
                        </div>
                    </motion.div>

                    {/* Details */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-2/3">
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase mb-6 tracking-tighter leading-none">
                            {movie.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 mb-8 text-white/50 font-bold uppercase text-[10px] tracking-[0.3em]">
                            <span className="flex items-center gap-2"><HiOutlineTag className="text-[#4F46E5] text-sm"/> {movie.genre}</span>
                            <span className="flex items-center gap-2"><HiOutlineCalendar className="text-[#4F46E5] text-sm"/> {movie.releaseDate}</span>
                            <span className="flex items-center gap-2"><HiOutlineUser className="text-[#4F46E5] text-sm"/> Curated by <span className="text-white">{movie.addedBy}</span></span>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-10 backdrop-blur-sm">
                            <h3 className="text-[#EAB308] font-black italic uppercase mb-4 tracking-widest text-sm">The Synopsis</h3>
                            <p className="text-white/70 leading-relaxed text-lg italic font-light">
                                {movie.plotSummary || "Every frame of this cinematic masterpiece tells a story of passion, grit, and visual wonder. A must-watch for any true film enthusiast."}
                            </p>
                        </div>

                        {/* --- PROTECTED ACTIONS: Only visible to the creator --- */}
                        {user?.uid === movie?.uid && (
                            <div className="flex flex-wrap gap-4 border-t border-white/10 pt-8">
                                <button 
                                    onClick={() => navigate(`/update-movie/${id}`)}
                                    className="flex-1 bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#EAB308] transition-all cursor-pointer uppercase tracking-widest text-xs"
                                >
                                    <HiOutlinePencilAlt className="text-lg" /> Update Entry
                                </button>
                                
                                <button 
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-600/10 border border-red-600/50 text-red-500 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all cursor-pointer uppercase tracking-widest text-xs"
                                >
                                    <HiOutlineTrash className="text-lg" /> Remove Movie
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;