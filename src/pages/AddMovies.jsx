import React, { useState, use, useEffect } from 'react';
import { AuthContext } from '../providers/AuthContext';
import useAxios from '../hooks/useAxios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AddMovies = () => {
    const { user, signOutUser } = use(AuthContext);
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        posterImg: '',
        genre: '',
        releaseDate: '',
        rating: '5',
        addedBy: user?.displayName || 'Anonymous'
    });

    // Verify user authentication on component mount
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

        // --- SWEETALERT CONFIRMATION ---
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to add this movie to the collection?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4F46E5",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, upload it!",
            background: "#1E293B",
            color: "#fff"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    // Verify user authentication before submission
                    if (!user || !user.uid) {
                        toast.error('Authentication failed. Please log in again.');
                        await signOutUser();
                        navigate('/login');
                        setLoading(false);
                        return;
                    }

                    // Prepare movie data
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

                    // Post to backend
                    const response = await axiosInstance.post('/movies', movieData);

                    if (response.status === 201 || response.status === 200) {
                        Swal.fire({
                            title: "Success!",
                            text: "The movie has been added successfully.",
                            icon: "success",
                            background: "#1E293B",
                            color: "#fff",
                            confirmButtonColor: "#4F46E5",
                        });

                        // Reset form
                        setFormData({
                            title: '',
                            posterImg: '',
                            genre: '',
                            releaseDate: '',
                            rating: '5',
                            addedBy: user?.displayName || 'Anonymous'
                        });

                        // Redirect
                        setTimeout(() => navigate('/allmovie'), 1500);
                    }
                } catch (error) {
                    console.error('Error adding movie:', error);
                    const errorMessage = error.response?.data?.message || error.message || 'Failed to add movie';
                    toast.error(errorMessage);
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#0F172A] via-[#1a1f3a] to-[#0F172A] py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
            >
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black text-white mb-2">Add New Movie</h1>
                        <p className="text-white/60 text-sm">Share your favorite movie with the community</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Movie Title */}
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">Movie Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter movie title"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                            />
                        </div>

                        {/* Poster Image Link */}
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">Poster Image Link <span className="text-red-500">*</span></label>
                            <input
                                type="url"
                                name="posterImg"
                                value={formData.posterImg}
                                onChange={handleInputChange}
                                placeholder="https://example.com/poster.jpg"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                            />
                            <p className="text-white/40 text-xs mt-1">Link to the movie poster image</p>
                        </div>

                        {/* Genre Selection */}
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">Genre <span className="text-red-500">*</span></label>
                            <select
                                name="genre"
                                value={formData.genre}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all cursor-pointer"
                            >
                                <option value="" className="bg-[#0F172A] text-white">Select a genre</option>
                                {genreOptions.map((g) => (
                                    <option key={g} value={g} className="bg-[#0F172A] text-white">
                                        {g}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Release Date */}
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">Release Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="releaseDate"
                                value={formData.releaseDate}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all cursor-pointer"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">Rating (1-10)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    name="rating"
                                    min="1"
                                    max="10"
                                    step="0.5"
                                    value={formData.rating}
                                    onChange={handleInputChange}
                                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                                />
                                <span className="bg-[#4F46E5] text-white font-bold px-3 py-2 rounded-lg min-w-15 text-center">
                                    {formData.rating}
                                </span>
                            </div>
                        </div>

                        {/* Added By (Read-only) */}
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">Added By</label>
                            <input
                                type="text"
                                value={formData.addedBy}
                                readOnly
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 focus:outline-none cursor-not-allowed opacity-60"
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 mt-8 cursor-pointer"
                        >
                            {loading ? 'Adding Movie...' : 'Add Movie'}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddMovies;