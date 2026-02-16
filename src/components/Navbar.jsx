import React, { useState } from 'react';
import { Mic, User, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    return (
        <nav className="border-b border-white/10 bg-darker/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto h-16 flex items-center justify-between">
                <Link to="/home" className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
                        <Mic className="w-4 h-4 text-white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        MeetSummary
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
                        <Link to="/about" className={`hover:text-white transition-colors ${location.pathname === '/about' ? 'text-white' : ''}`}>
                            About
                        </Link>
                        <Link to="/history" className={`hover:text-white transition-colors ${location.pathname === '/history' ? 'text-white' : ''}`}>
                            History
                        </Link>
                    </div>

                    <div className="h-6 w-px bg-white/10" />

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-300">
                                {user.name}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors ml-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6 text-gray-400" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-400" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-darker/95 backdrop-blur-lg">
                    <div className="container mx-auto py-4 space-y-4">
                        <Link
                            to="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block py-2 px-4 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/about' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            About
                        </Link>
                        <Link
                            to="/history"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block py-2 px-4 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/history' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            History
                        </Link>

                        <div className="border-t border-white/10 pt-4 mt-4">
                            <div className="flex items-center gap-3 px-4 py-2">
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <span className="text-sm font-medium text-gray-300">{user.name}</span>
                            </div>

                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 mt-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
