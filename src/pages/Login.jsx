import React, { useState, use, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { AuthContext } from '../providers/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Login = () => {
    const { signInWithEmail, signInWithGoogle } = use(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const passwordVisibilityTimer = useRef(null);

    const handlePasswordVisibilityToggle = () => {
        setShowPassword(true);
        if (passwordVisibilityTimer.current) {
            clearTimeout(passwordVisibilityTimer.current);
        }
        passwordVisibilityTimer.current = setTimeout(() => {
            setShowPassword(false);
        }, 5000);
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!email.trim()) {
                toast.error('Email is required');
                setLoading(false);
                return;
            }
            if (!password.trim()) {
                toast.error('Password is required');
                setLoading(false);
                return;
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
            if (!passwordRegex.test(password)) {
                toast.error('Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long');
                setLoading(false);
                return;
            }

            await signInWithEmail(email, password);
            const from = location.state?.from?.pathname || '/';
            navigate(from);
        } catch (err) {
            const errorMessage = err.message || 'Failed to log in. Please check your credentials.';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGoogle();
            toast.success('Logged in with Google successfully!');
            const from = location.state?.from?.pathname || '/';
            navigate(from);
        } catch (err) {
            const errorMessage = err.message || 'Failed to log in with Google.';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-linear-to-br dark:from-[#0F172A] dark:via-[#1a1f3a] dark:to-[#0F172A] flex items-center justify-center px-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* CHANGED: Card background and border responsiveness */}
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-none">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-linear-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="font-black text-3xl text-white italic">M</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500 dark:text-white/60 text-sm">Sign in to your MovieMaster PRO account</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-lg mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Email Address <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pr-12 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={handlePasswordVisibilityToggle}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/60 hover:text-[#EAB308] transition-colors"
                                >
                                    {showPassword ? <HiOutlineEyeOff className="text-xl" /> : <HiOutlineEye className="text-xl" />}
                                </button>
                            </div>
                            <p className="text-slate-400 dark:text-white/40 text-xs mt-1 font-medium">Min 6 chars: 1 uppercase, 1 lowercase</p>
                        </div>

                        <div className="text-right">
                            <button type="button" className="text-[#EAB308] text-xs font-bold hover:underline">Forgot Password?</button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </motion.button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
                        <span className="text-slate-400 dark:text-white/50 text-xs font-bold">OR</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        type="button"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <FcGoogle className="text-2xl" />
                        Continue with Google
                    </motion.button>

                    <p className="text-center text-slate-500 dark:text-white/60 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#EAB308] font-bold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;