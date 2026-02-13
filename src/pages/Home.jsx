import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, List, Sparkles, LogOut, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'User' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-darker text-white pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        Welcome, {user.name}
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        MeetSummary transforms your conversations into actionable insights.
                        Record meetings, generate AI-powered summaries, and keep your team aligned.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <Link to="/generate" className="group">
                            <div className="glass-panel p-8 h-full hover:bg-white/5 transition-all duration-300 border border-white/10 hover:border-primary/50">
                                <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Mic className="w-7 h-7 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">New Meeting</h3>
                                <p className="text-gray-400">Record or upload audio to generate a new summary.</p>
                            </div>
                        </Link>

                        <Link to="/history" className="group">
                            <div className="glass-panel p-8 h-full hover:bg-white/5 transition-all duration-300 border border-white/10 hover:border-purple/50">
                                <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <List className="w-7 h-7 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">View History</h3>
                                <p className="text-gray-400">Access and manage your past meeting summaries.</p>
                            </div>
                        </Link>
                    </div>

                    <div className="mt-12">
                        <Link to="/about" className="text-gray-500 hover:text-white flex items-center justify-center gap-2 transition-colors">
                            <Info className="w-4 h-4" />
                            Learn more about how it works
                        </Link>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Home;
