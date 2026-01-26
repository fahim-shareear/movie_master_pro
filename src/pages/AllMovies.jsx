import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlineArrowRight } from 'react-icons/hi';
import useAxios from '../hooks/useAxios';

const AllMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    // Fetch all movies on component mount
    useEffect(() => {
        
        const fetchMovies = async () => {
            try {
                console.log('Fetching movies from server...');
                const response = await axiosInstance.get('/movies');
                console.log('Movies fetched:', response.data);
                setMovies(response.data);
                setLoading(false);
            } catch (error) {
                if (error.name !== 'CanceledError') {
                    console.error('Error fetching movies:', error);
                    toast.error('Failed to load movies');
                    setLoading(false);
                }
            }
        };

        fetchMovies();

        // Cleanup function to abort request on unmount
    }, []);

    // Get recently added movies (first 5)
    const recentMovies = movies.slice(0, 5);

    // Group movies by genre
    const moviesByGenre = {};
    movies.forEach(movie => {
        const genre = movie.genre || 'Other';
        if (!moviesByGenre[genre]) {
            moviesByGenre[genre] = [];
        }
        moviesByGenre[genre].push(movie);
    });

    // Get top 3 genres with most movies
    const topGenres = Object.entries(moviesByGenre)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 3);

    const MovieCard = ({ movie }) => (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-full cursor-pointer"
            onClick={() => navigate(`/movie/${movie._id}`)}
        >
            <div className="relative h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-[#4F46E5]/50 transition-all duration-300">
                {/* Poster Image */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-linear-to-b from-[#4F46E5]/20 to-[#7C3AED]/20">
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-[#EAB308] text-black font-bold px-3 py-1 rounded-lg text-sm">
                        {movie.rating}★
                    </div>
                </div>

                {/* Movie Info */}
                <div className="p-4 flex flex-col gap-3 h-48">
                    <div>
                        <h3 className="text-white font-bold text-lg line-clamp-2 group-hover:text-[#EAB308] transition-colors">
                            {movie.title}
                        </h3>
                        <p className="text-white/50 text-xs mt-1">{movie.releaseYear}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="bg-[#4F46E5]/30 text-[#4F46E5] text-xs px-2 py-1 rounded">
                            {movie.genre}
                        </span>
                    </div>

                    <div className="mt-auto flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/movie/${movie._id}`);
                            }}
                            className="flex-1 bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                        >
                            View Details
                            <HiOutlineArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const RecentMovieCard = ({ movie }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => navigate(`/movie/${movie._id}`)}
        >
            <div className="relative h-96 rounded-2xl overflow-hidden group">
                {/* Background Image */}
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-3xl font-black text-white mb-2">{movie.title}</h2>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-[#EAB308] text-black font-bold px-4 py-2 rounded-lg">
                            {movie.rating}★ Rating
                        </div>
                        <span className="text-white/80 text-lg">{movie.releaseYear}</span>
                        <span className="bg-[#4F46E5]/50 text-white px-3 py-1 rounded-lg">{movie.genre}</span>
                    </div>
                    <p className="text-white/90 text-sm line-clamp-2 mb-4">{movie.plotSummary}</p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/movie/${movie._id}`);
                        }}
                        className="bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 group"
                    >
                        View Details
                        <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-linear-to-br from-[#0F172A] via-[#1a1f3a] to-[#0F172A] flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-[#4F46E5] border-t-[#EAB308]"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute inset-2 rounded-full border-4 border-[#7C3AED]/30 border-b-[#EAB308]/50"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#EAB308] rounded-full"></div>
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-white mb-2">Loading Movies</h1>
                    <p className="text-white/60 text-lg">Please wait while we fetch the content for you...</p>

                    <div className="mt-8 w-64 mx-auto">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-linear-to-r from-[#4F46E5] to-[#7C3AED]"
                                animate={{ width: ['0%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 justify-center mt-6">
                        {[0, 1, 2].map((dot) => (
                            <motion.div
                                key={dot}
                                className="w-2 h-2 bg-[#EAB308] rounded-full"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#0F172A] via-[#1a1f3a] to-[#0F172A] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-black text-white mb-2">No Movies Found</h1>
                    <p className="text-white/60">Be the first to add a movie!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#0F172A] via-[#1a1f3a] to-[#0F172A] py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Recently Added Movies Swiper */}
                {recentMovies.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-2">
                            <div className="w-2 h-8 bg-[#EAB308] rounded"></div>
                            Recently Added
                        </h2>
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            loop={recentMovies.length > 1}
                            spaceBetween={20}
                            className="pb-12!"
                        >
                            {recentMovies.map((movie) => (
                                <SwiperSlide key={movie._id}>
                                    <RecentMovieCard movie={movie} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}

                {/* Genre-based Swippers */}
                {topGenres.map(([genre, genreMovies]) => (
                    <div key={genre} className="mb-16">
                        <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-2">
                            <div className="w-2 h-8 bg-[#7C3AED] rounded"></div>
                            {genre}
                        </h2>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                                1280: { slidesPerView: 4 }
                            }}
                            className="pb-12!"
                        >
                            {genreMovies.map((movie) => (
                                <SwiperSlide key={movie._id}>
                                    <MovieCard movie={movie} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllMovies;