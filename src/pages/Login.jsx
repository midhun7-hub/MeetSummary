import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password
            });

            // Save user data
            localStorage.setItem('user', JSON.stringify(response.data));

            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-darker flex overflow-hidden text-white font-sans">
            {/* Left Side: Branding and Info */}
            <div className="hidden lg:flex lg:w-1/2 bg-darker flex-col justify-center px-12 xl:px-24 relative overflow-hidden ring-1 ring-white/5">
                {/* Decorative gradients removed to ensure perfect logo blending with solid #040404 background */}


                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 relative overflow-hidden flex items-center justify-center">
                            <img src="/logo.png" alt="MeetSummary" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white">MeetSummary</h1>
                    </div>

                    <h2 className="text-5xl font-extrabold mb-6 leading-tight">
                        Shorten your meetings, <br />
                        <span className="text-primary italic">Heighten your productivity.</span>
                    </h2>

                    <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                        Hello! Welcome to MeetSummary. Join us to transform your long meetings into concise, actionable summaries automatically using multimodal AI.
                    </p>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-colors">
                                <Mic className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Crystal Clear Transcription</h4>
                                <p className="text-sm text-gray-500">Accurate speech-to-text for every meeting.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-colors">
                                <ArrowRight className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold">AI Powered Insights</h4>
                                <p className="text-sm text-gray-500">Extract action items and key takeaways instantly.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom decor */}
                <div className="absolute bottom-12 left-12 xl:left-24 text-gray-600 text-sm font-medium">
                    &copy; 2025 MeetSummary AI Platforms.
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-grey relative">
                {/* Mobile version logo/header */}
                <div className="lg:hidden absolute top-8 left-8 right-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold text-lg">MeetSummary</span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold mb-3">Sign In</h2>
                        <p className="text-gray-400">Enter your credentials to access your account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-600"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-gray-300">Password</label>
                                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-gray-600"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign in to Dashboard</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-400">
                        New to MeetSummary?{' '}
                        <Link to="/signup" className="text-primary font-bold hover:underline">
                            Create an account
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
