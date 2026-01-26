import React, { useState, use, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { AuthContext } from '../providers/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast, { ToastBar } from 'react-hot-toast';

const Login = () => {
    const { signInWithEmail, signInWithGoogle } = use(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const passwordVisibilityTimer = useRef(null);

    const handlePasswordVisibilityToggle = () => {
        setShowPassword(true);
        
        // Clear any existing timer
        if (passwordVisibilityTimer.current) {
            clearTimeout(passwordVisibilityTimer.current);
        }
        
        // Set new timer to hide password after 5 seconds
        passwordVisibilityTimer.current = setTimeout(() => {
            setShowPassword(false);
        }, 5000);
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate required fields
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

            // Password regex validation: at least one uppercase, one lowercase, and 6+ characters
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
        <>
            <div className="min-h-screen bg-linear-to-br from-[#0F172A] via-[#1a1f3a] to-[#0F172A] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-linear-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="font-black text-3xl text-white italic">M</span>
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-white/60 text-sm">Sign in to your MovieMaster PRO account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm px-4 py-3 rounded-lg mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">Email Address <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={handlePasswordVisibilityToggle}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-[#EAB308] transition-colors"
                                >
                                    {showPassword ? (
                                        <HiOutlineEyeOff className="text-xl" />
                                    ) : (
                                        <HiOutlineEye className="text-xl" />
                                    )}
                                </button>
                            </div>
                            <p className="text-white/40 text-xs mt-1">Min 6 chars: 1 uppercase, 1 lowercase</p>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <button 
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-[#EAB308] text-xs font-bold hover:underline transition-all"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Login Button */}
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

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-white/50 text-xs font-bold">OR</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                    </div>

                    {/* Google Login */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        type="button"
                        className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <FcGoogle className="text-2xl" />
                        Continue with Google
                    </motion.button>

                    {/* Sign Up Link */}
                    <p className="text-center text-white/60 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#EAB308] font-bold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                    </div>
                </motion.div>
            </div>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showForgotPassword && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForgotPassword(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
                        >
                            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">Reset Password</h2>
                                        <p className="text-white/60 text-sm mt-1">Enter your email to receive reset instructions</p>
                                    </div>
                                    <button
                                        onClick={() => setShowForgotPassword(false)}
                                        className="text-2xl text-white/60 hover:text-white transition-colors"
                                    >
                                        <HiOutlineX />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-5">
                                    {/* Email Input */}
                                    <div>
                                        <label className="block text-white text-sm font-bold mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all"
                                        />
                                        <p className="text-white/40 text-xs mt-2">We'll send you a link to reset your password</p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => setShowForgotPassword(false)}
                                            className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex-1 bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
                                        >
                                            Send Link
                                        </motion.button>
                                    </div>
                                </form>

                                {/* Info Box */}
                                <div className="mt-6 p-4 bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl">
                                    <p className="text-[#EAB308] text-xs font-bold">💡 Note</p>
                                    <p className="text-white/60 text-xs mt-1">Check your email (including spam folder) for the password reset link. It will expire in 24 hours.</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Login;