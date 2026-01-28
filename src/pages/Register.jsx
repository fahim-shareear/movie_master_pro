import React, { useState, use, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { AuthContext } from '../providers/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { updateProfile } from 'firebase/auth';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Register = () => {
    const { creatingUserWithEmail, signInWithGoogle } = use(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        photoURL: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const passwordVisibilityTimer = useRef(null);
    const confirmPasswordVisibilityTimer = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordVisibilityToggle = () => {
        setShowPassword(true);
        if (passwordVisibilityTimer.current) {
            clearTimeout(passwordVisibilityTimer.current);
        }
        passwordVisibilityTimer.current = setTimeout(() => {
            setShowPassword(false);
        }, 5000);
    };

    const handleConfirmPasswordVisibilityToggle = () => {
        setShowConfirmPassword(true);
        if (confirmPasswordVisibilityTimer.current) {
            clearTimeout(confirmPasswordVisibilityTimer.current);
        }
        confirmPasswordVisibilityTimer.current = setTimeout(() => {
            setShowConfirmPassword(false);
        }, 5000);
    };

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.name.trim()) {
                toast.error('Full name is required');
                setLoading(false);
                return;
            }
            if (!formData.email.trim()) {
                toast.error('Email is required');
                setLoading(false);
                return;
            }
            if (!formData.password.trim()) {
                toast.error('Password is required');
                setLoading(false);
                return;
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
            if (!passwordRegex.test(formData.password)) {
                toast.error('Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long');
                setLoading(false);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                setLoading(false);
                return;
            }

            // Firebase Registration
            const result = await creatingUserWithEmail(formData.email, formData.password);
            
            await updateProfile(result.user, {
                displayName: formData.name,
                photoURL: formData.photoURL || 'https://via.placeholder.com/150'
            });

            // Save to Backend
            const userData = {
                uid: result.user.uid,
                name: formData.name,
                email: formData.email,
                photoURL: formData.photoURL || 'https://via.placeholder.com/150',
                registeredAt: new Date().toISOString()
            };

            console.log('Sending user data to server:', userData);

            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (!response.ok) {
                console.warn('Warning: Could not save user to database, but registration was successful');
            }

            toast.success('Registration successful! Welcome to MovieMaster PRO 🎬');
            const from = location.state?.from?.pathname || '/';
            setTimeout(() => navigate(from), 1500);
        } catch (err) {
            let errorMessage = 'Failed to register. Please try again.';
            if (err.code === 'auth/email-already-in-use') errorMessage = 'Email is already registered';
            else if (err.code === 'auth/invalid-email') errorMessage = 'Invalid email address';
            else if (err.code === 'auth/weak-password') errorMessage = 'Password is too weak';
            else errorMessage = err.message || 'Failed to register. Please try again.';
            
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setLoading(true);
        try {
            const result = await signInWithGoogle();
            
            const userData = {
                uid: result.user.uid,
                name: result.user.displayName || 'Google User',
                email: result.user.email,
                photoURL: result.user.photoURL,
                registeredAt: new Date().toISOString()
            };

            console.log('Sending Google user data to server:', userData);

            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            toast.success('Registration successful! Welcome to MovieMaster PRO 🎬');
            const from = location.state?.from?.pathname || '/';
            setTimeout(() => navigate(from), 1500);
        } catch (err) {
            toast.error(err.message || 'Failed to register with Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-linear-to-br dark:from-[#0F172A] dark:via-[#1a1f3a] dark:to-[#0F172A] flex items-center justify-center px-4 py-8 transition-colors duration-300">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-none">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-linear-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="font-black text-3xl text-white italic">M</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Join MovieMaster</h1>
                        <p className="text-slate-500 dark:text-white/60 text-sm">Create your cinematic identity</p>
                    </div>

                    <form onSubmit={handleEmailRegister} className="space-y-4">
                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Full Name <span className="text-red-500">*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all" />
                        </div>

                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Email Address <span className="text-red-500">*</span></label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all" />
                        </div>

                        <div>
                            <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Photo URL (Optional)</label>
                            <input type="url" name="photoURL" value={formData.photoURL} onChange={handleInputChange} placeholder="https://example.com/photo.jpg" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Password <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pr-10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]" />
                                    <button type="button" onClick={handlePasswordVisibilityToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/60 hover:text-[#EAB308]"><HiOutlineEye size={18}/></button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-700 dark:text-white text-sm font-bold mb-2">Confirm <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pr-10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]" />
                                    <button type="button" onClick={handleConfirmPasswordVisibilityToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/60 hover:text-[#EAB308]"><HiOutlineEye size={18}/></button>
                                </div>
                            </div>
                        </div>

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-linear-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 mt-4">
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </motion.button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
                        <span className="text-slate-400 dark:text-white/50 text-xs font-bold">OR</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGoogleRegister} disabled={loading} type="button" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <FcGoogle className="text-2xl" /> Sign Up with Google
                    </motion.button>

                    <p className="text-center text-slate-500 dark:text-white/60 text-sm mt-6">
                        Already have an account? <Link to="/login" className="text-[#EAB308] font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;