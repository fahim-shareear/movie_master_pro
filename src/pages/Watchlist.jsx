import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlay, HiOutlineTrash, HiOutlineChevronUp, HiOutlineChevronDown, HiOutlineFilm } from 'react-icons/hi';
import { AuthContext } from '../providers/AuthContext';
import useAxios from '../hooks/useAxios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const Watchlist = () => {
    const { user } = useContext(AuthContext);
    const axiosInstance = useAxios();
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            axiosInstance.get('/watchlist')
                .then(res => {
                    setWatchlist(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    toast.error("Could not load watchlist");
                    setLoading(false);
                });
        }
    }, [user, axiosInstance]);

    const moveItem = (index, direction) => {
        const newPos = index + direction;
        if (newPos < 0 || newPos >= watchlist.length) return;
        const updatedList = [...watchlist];
        const [movedItem] = updatedList.splice(index, 1);
        updatedList.splice(newPos, 0, movedItem);
        setWatchlist(updatedList);
    };

    const handleRemove = (id) => {
        Swal.fire({
            title: "Remove from Watchlist?",
            text: "You can always add it back later.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            confirmButtonText: "Remove",
            background: "#1E293B",
            color: "#fff"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/watchlist/${id}`);
                    
                    // 1. Update Local UI State
                    setWatchlist(watchlist.filter(item => item._id !== id));
                    
                    // 2. 🔥 SIGNAL NAVBAR: Update the count badge instantly
                    window.dispatchEvent(new Event('watchlistUpdated'));

                    toast.success("Removed from watchlist");
                } catch (err) {
                    toast.error("Failed to remove item");
                }
            }
        });
    };

    if (loading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-[#EAB308]">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0F172A] py-24 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">My Watchlist</h1>
                        <p className="text-[#EAB308] text-xs font-bold uppercase tracking-widest mt-2">{watchlist.length} Movies in Queue</p>
                    </div>
                </header>

                <div className="flex flex-col gap-4">
                    <AnimatePresence>
                        {watchlist.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20 text-white/40 italic">
                                Your watchlist is empty.
                            </motion.div>
                        ) : (
                            watchlist.map((item, index) => (
                                <motion.div key={item._id} layout exit={{ opacity: 0, x: 20 }} className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-3xl">
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="text-white/20 hover:text-[#EAB308] disabled:opacity-0"><HiOutlineChevronUp size={20}/></button>
                                        <button onClick={() => moveItem(index, 1)} disabled={index === watchlist.length - 1} className="text-white/20 hover:text-[#EAB308] disabled:opacity-0"><HiOutlineChevronDown size={20}/></button>
                                    </div>
                                    <img src={item.moviePoster} className="w-16 h-24 object-cover rounded-xl" alt="" />
                                    <div className="flex-1">
                                        <h3 className="text-white font-black uppercase text-sm">{item.movieTitle}</h3>
                                        <span className="text-[#4F46E5] text-[10px] font-black uppercase tracking-widest">{item.movieGenre}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => toast.success("Playing...")} className="bg-white text-black p-3 rounded-xl hover:bg-[#EAB308]"><HiOutlinePlay/></button>
                                        <button onClick={() => handleRemove(item._id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl"><HiOutlineTrash/></button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Watchlist;