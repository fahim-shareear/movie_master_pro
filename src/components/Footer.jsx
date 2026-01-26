import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <FaFacebookF />, url: "#", color: "hover:bg-blue-600" },
        { icon: <FaXTwitter />, url: "#", color: "hover:bg-sky-500" },
        { icon: <FaInstagram />, url: "#", color: "hover:bg-pink-600" },
        { icon: <FaYoutube />, url: "#", color: "hover:bg-red-600" },
        { icon: <FaGithub />, url: "#", color: "hover:bg-gray-700" }
    ];

    const quickLinks = [
        { name: "Home", path: "/" },
        { name: "All Movies", path: "/allmovie" },
        { name: "Add Movie", path: "/movies/add" },
        { name: "My Watchlist", path: "/watchlist" },
        { name: "About Us", path: "#" }
    ];

    return (
        <footer className="bg-[#0F172A] border-t border-white/5 pt-16 pb-8 text-white font-sans">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    
                    {/* Brand & Copyright Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-linear-to-br from-[#4F46E5] to-[#7C3AED] rounded-lg flex items-center justify-center font-black text-sm italic">M</div>
                            <span className="text-xl font-black italic tracking-tighter uppercase">MovieMaster<span className="text-[#EAB308]">Pro</span></span>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                            The ultimate destination for cinematic enthusiasts. Discover, curate, and explore the world of film with professional-grade tools.
                        </p>
                        <p className="text-white/30 text-xs mt-4">
                            &copy; {currentYear} MovieMaster Pro. All rights reserved.
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h4 className="text-[#EAB308] font-bold uppercase tracking-widest text-sm mb-6 italic">Quick Links</h4>
                        <ul className="grid grid-cols-2 gap-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        to={link.path} 
                                        className="text-white/60 hover:text-[#4F46E5] transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-[#4F46E5] transition-colors"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Media Section */}
                    <div>
                        <h4 className="text-[#EAB308] font-bold uppercase tracking-widest text-sm mb-6 italic">Connect With Us</h4>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.url}
                                    whileHover={{ y: -5 }}
                                    className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg transition-all ${social.color}`}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                        <div className="mt-8">
                            <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Newsletter</p>
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    placeholder="Your email" 
                                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-[#4F46E5] grow"
                                />
                                <button className="bg-[#4F46E5] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#7C3AED] transition-colors">JOIN</button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                    <div>Designed for Cinephiles</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;