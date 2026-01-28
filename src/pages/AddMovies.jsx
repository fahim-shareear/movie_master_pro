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
        details: '', // RESTORED
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
                    const movieData = {
                        title: formData.title,
                        posterImg: formData.posterImg,
                        genre: formData.genre,
                        releaseDate: formData.releaseDate,
                        rating: parseFloat(formData.rating),
                        details: formData.details, // RESTORED
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
                            details: '', // RESTORED
                            addedBy: user?.displayName || 'Anonymous'
                        });

                        setTimeout(() => navigate('/allmovie'), 1500);
                    }
                } catch (error) {
                    toast.error(error.message || 'Failed to add movie');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-linear-to-br dark:from-[#0F172A] dark:via-[#1a1f3a] dark:to-[#0F172A] py-12 px-4 transition-colors duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Add New Movie</h1>
                        <p className="text-slate-500 dark:text-white/60 text-sm">Share your favorite movie with the community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Movie Title <span className="text-red-500">*</span></label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter movie title" required className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                        </div>

                        {/* Poster */}
                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Poster Image Link <span className="text-red-500">*</span></label>
                            <input type="url" name="posterImg" value={formData.posterImg} onChange={handleInputChange} placeholder="https://example.com/poster.jpg" required className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4F46E5] outline-none" />
                        </div>

                        {/* Genre & Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Genre <span className="text-red-500">*</span></label>
                                <select name="genre" value={formData.genre} onChange={handleInputChange} required className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none">
                                    <option value="" className="bg-white dark:bg-[#0F172A]">Select a genre</option>
                                    {genreOptions.map((g) => <option key={g} value={g} className="bg-white dark:bg-[#0F172A]">{g}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Release Date <span className="text-red-500">*</span></label>
                                <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} required className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none" />
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Rating (1-10)</label>
                            <div className="flex items-center gap-4">
                                <input type="range" name="rating" min="1" max="10" step="0.5" value={formData.rating} onChange={handleInputChange} className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]" />
                                <span className="bg-[#4F46E5] text-white font-bold px-3 py-2 rounded-lg min-w-15 text-center">{formData.rating}</span>
                            </div>
                        </div>

                        {/* RESTORED: Details/Description Field */}
                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Movie Details/Summary <span className="text-red-500">*</span></label>
                            <textarea name="details" value={formData.details} onChange={handleInputChange} placeholder="Enter movie summary or details..." required rows="4" className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4F46E5] outline-none resize-none"></textarea>
                        </div>

                        {/* Added By */}
                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Added By</label>
                            <input type="text" value={formData.addedBy} readOnly className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-500 dark:text-white/60 cursor-not-allowed opacity-60" />
                        </div>

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 mt-8">
                            {loading ? 'Adding Movie...' : 'Add Movie'}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddMovies;