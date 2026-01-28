import React, { useState, use, useEffect } from 'react';
import { AuthContext } from '../providers/AuthContext';
import useAxios from '../hooks/useAxios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const AddMovies = () => {
    const { user, signOutUser } = use(AuthContext);
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Theme detection for SweetAlert2
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    const [formData, setFormData] = useState({
        title: '',
        posterImg: '',
        genre: '',
        releaseDate: '',
        rating: '5',
        addedBy: user?.displayName || 'Anonymous'
    });

    useEffect(() => {
        if (!user || !user.uid) {
            toast.error('Please log in to add movies');
            signOutUser().then(() => {
                navigate('/login');
            }).catch(() => {
                navigate('/login');
            });
        }
    }, [user, navigate, signOutUser]);

    const genreOptions = [
        'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 
        'Adventure', 'Animation', 'Crime', 'Documentary', 'Family', 'Fantasy', 
        'Musical', 'Mystery', 'Western'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to add this movie to the collection?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4F46E5",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, upload it!",
            background: isDark ? "#1E293B" : "#fff",
            color: isDark ? "#fff" : "#0F172A"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    if (!user || !user.uid) {
                        toast.error('Authentication failed. Please log in again.');
                        await signOutUser();
                        navigate('/login');
                        setLoading(false);
                        return;
                    }

                    const movieData = {
                        title: formData.title,
                        posterImg: formData.posterImg,
                        genre: formData.genre,
                        releaseDate: formData.releaseDate,
                        rating: parseFloat(formData.rating),
                        addedBy: formData.addedBy,
                        addedAt: new Date().toISOString(),
                        uid: user?.uid
                    };

                    const response = await axiosInstance.post('/movies', movieData);

                    if (response.status === 201 || response.status === 200) {
                        Swal.fire({
                            title: "Success!",
                            text: "The movie has been added successfully.",
                            icon: "success",
                            background: isDark ? "#1E293B" : "#fff",
                            color: isDark ? "#fff" : "#0F172A",
                            confirmButtonColor: "#4F46E5",
                        });

                        setFormData({
                            title: '',
                            posterImg: '',
                            genre: '',
                            releaseDate: '',
                            rating: '5',
                            addedBy: user?.displayName || 'Anonymous'
                        });

                        setTimeout(() => navigate('/allmovie'), 1500);
                    }
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message || 'Failed to add movie';
                    toast.error(errorMessage);
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-linear-to-br dark:from-[#0F172A] dark:via-[#1a1f3a] dark:to-[#0F172A] py-24 px-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
            >
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-none">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight italic uppercase">Add New Movie</h1>
                        <p className="text-slate-500 dark:text-white/60 text-sm font-medium">Share your favorite movie with the community</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Movie Title */}
                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2 ml-1">Movie Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter movie title"
                                required
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                            />
                        </div>

                        {/* Poster Image Link */}
                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2 ml-1">Poster Image Link <span className="text-red-500">*</span></label>
                            <input
                                type="url"
                                name="posterImg"
                                value={formData.posterImg}
                                onChange={handleInputChange}
                                placeholder="https://example.com/poster.jpg"
                                required
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Genre Selection */}
                            <div>
                                <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2 ml-1">Genre <span className="text-red-500">*</span></label>
                                <select
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all cursor-pointer appearance-none"
                                >
                                    <option value="" className="bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white">Select a genre</option>
                                    {genreOptions.map((g) => (
                                        <option key={g} value={g} className="bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white">
                                            {g}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Release Date */}
                            <div>
                                <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2 ml-1">Release Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    name="releaseDate"
                                    value={formData.releaseDate}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2 ml-1">Rating (1-10)</label>
                            <div className="flex items-center gap-6 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                                <input
                                    type="range"
                                    name="rating"
                                    min="1"
                                    max="10"
                                    step="0.5"
                                    value={formData.rating}
                                    onChange={handleInputChange}
                                    className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                                />
                                <span className="bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white font-black px-5 py-2 rounded-xl min-w-15 text-center shadow-lg">
                                    {formData.rating}
                                </span>
                            </div>
                        </div>

                        {/* Added By (Read-only) */}
                        <div>
                            <label className="block text-slate-400 dark:text-white/30 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Contributor</label>
                            <input
                                type="text"
                                value={formData.addedBy}
                                readOnly
                                className="w-full bg-transparent border border-dashed border-slate-300 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-400 dark:text-white/40 focus:outline-none cursor-not-allowed italic text-sm"
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white font-black py-5 rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all disabled:opacity-50 mt-8 cursor-pointer uppercase tracking-widest text-sm"
                        >
                            {loading ? 'Adding Movie...' : 'Add Movie to Collection'}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddMovies;