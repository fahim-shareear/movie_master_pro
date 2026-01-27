import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineX, HiOutlineCheck, HiOutlineArrowLeft } from 'react-icons/hi';
import useAxios from '../hooks/useAxios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { use } from 'react';
import { AuthContext } from '../providers/AuthContext';

const MyCollection = () => {
    const { user } = use(AuthContext);
    const axiosInstance = useAxios();
    
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (user?.uid) {
            axiosInstance.get('/my-movies')
                .then(res => {
                    setMovies(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    toast.error("Failed to fetch movies");
                    setLoading(false);
                });
        }
    }, [user, axiosInstance]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Using PATCH method for partial updates
            await axiosInstance.patch(`/movies/${selectedMovie._id}`, formData);
            
            // Sync local UI state immediately
            setMovies(movies.map(m => m._id === selectedMovie._id ? { ...m, ...formData } : m));
            
            Swal.fire({
                title: "Updated!",
                text: "The movie record has been successfully modified.",
                icon: "success",
                background: "#1E293B", color: "#fff"
            });
            setIsEditing(false);
            setSelectedMovie(null);
        } catch (err) {
            toast.error(err.message || "Update failed. Check CORS or Permissions.");
        }
    };

    const handleDelete = (id) => {
        setSelectedMovie(null);
        Swal.fire({
            title: "Delete Movie?",
            text: "This action is permanent.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            confirmButtonText: "Yes, delete it",
            background: "#1E293B", color: "#fff"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/movies/${id}`);
                    setMovies(movies.filter(m => m._id !== id));
                    toast.success("Movie deleted");
                } catch (err) { toast.error( err.message || "Could not delete."); }
            }
        });
    };

    if (loading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0F172A] py-24 px-4 font-sans">
            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-black italic uppercase text-white mb-10 tracking-tighter border-l-8 border-[#EAB308] pl-4">
                    My Collection
                </h1>

                <div className="flex flex-col gap-5">
                    {movies.length === 0 ? (
                        <p className="text-white/30 italic text-center py-10">No movies added by you yet.</p>
                    ) : (
                        movies.map(movie => (
                            <div 
                                key={movie._id} 
                                onClick={() => { setSelectedMovie(movie); setIsEditing(false); }}
                                className="flex items-center gap-5 bg-white/5 p-4 rounded-4xl border border-white/10 hover:border-[#EAB308]/40 transition-all cursor-pointer group"
                            >
                                <img src={movie.posterUrl} alt={movie.title} className="w-20 h-28 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform" />
                                <div className="flex-1">
                                    <h2 className="text-white font-black uppercase text-lg leading-tight">{movie.title}</h2>
                                    <p className="text-[#EAB308] font-bold text-xs uppercase tracking-widest mt-1">{movie.genre}</p>
                                </div>
                                <div className="text-white/20 group-hover:text-[#EAB308] transition-colors pr-4">
                                    <HiOutlinePencilAlt size={24} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- MODAL SYSTEM --- */}
            <AnimatePresence>
                {selectedMovie && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMovie(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                        
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md bg-[#1E293B] rounded-[3rem] p-10 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            {!isEditing ? (
                                <div className="text-center">
                                    <img src={selectedMovie.posterUrl} alt={selectedMovie.title} className="w-32 h-44 mx-auto rounded-2xl mb-6 shadow-2xl border-4 border-white/5" />
                                    <h2 className="text-3xl font-black text-white uppercase italic leading-none mb-2">{selectedMovie.title}</h2>
                                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-10">Creator Management</p>
                                    
                                    <div className="flex flex-col gap-4">
                                        <button onClick={() => { setFormData({...selectedMovie}); setIsEditing(true); }} className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest hover:bg-[#EAB308] transition-all">
                                            <HiOutlinePencilAlt size={20}/> Edit Details
                                        </button>
                                        <button onClick={() => handleDelete(selectedMovie._id)} className="text-red-500 font-black text-[10px] uppercase tracking-widest hover:text-red-400 transition-colors">
                                            Delete Permanently
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdate} className="space-y-5">
                                    <div className="flex items-center gap-4 mb-4">
                                        <button type="button" onClick={() => setIsEditing(false)} className="p-2 bg-white/5 rounded-full text-white/50 hover:text-white"><HiOutlineArrowLeft/></button>
                                        <h2 className="text-xl font-black text-white uppercase italic">Modify Data</h2>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-black text-[#EAB308] tracking-widest ml-1">Title</label>
                                        <input value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#EAB308] transition-colors" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-black text-[#EAB308] tracking-widest ml-1">Genre</label>
                                            <input value={formData.genre || ""} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#EAB308]" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-black text-[#EAB308] tracking-widest ml-1">Rating</label>
                                            <input type="number" step="0.1" value={formData.rating || ""} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#EAB308]" />
                                        </div>
                                    </div>

                                    {/* --- NEW: POSTER IMAGE URL FIELD --- */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-black text-[#EAB308] tracking-widest ml-1">Poster Image URL</label>
                                        <input 
                                            type="url"
                                            value={formData.posterUrl || ""} 
                                            onChange={e => setFormData({...formData, posterUrl: e.target.value})} 
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#EAB308] transition-colors" 
                                            placeholder="Paste image link here"
                                        />
                                    </div>

                                    {/* --- NEW: PLOT SUMMARY FIELD --- */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-black text-[#EAB308] tracking-widest ml-1">Plot Summary</label>
                                        <textarea 
                                            rows="4"
                                            value={formData.plotSummary || ""} 
                                            onChange={e => setFormData({...formData, plotSummary: e.target.value})} 
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#EAB308] transition-colors resize-none text-sm" 
                                            placeholder="Enter movie description..."
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-black text-white/20 tracking-widest ml-1">ADDED BY</label>
                                        <div className="w-full bg-white/5 border border-transparent p-4 rounded-2xl text-white/20 text-xs italic">{selectedMovie.addedBy}</div>
                                    </div>

                                    <button type="submit" className="w-full bg-[#EAB308] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-[#EAB308]/20 mt-8">
                                        <HiOutlineCheck size={20}/> Save Changes
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyCollection;