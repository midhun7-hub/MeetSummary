import React from 'react';
import { Mic, User, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null; // Don't show navbar if not logged in (though protected routes handle this)

    return (
        <nav className="border-b border-white/10 bg-darker/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/home" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
                        <Mic className="w-4 h-4 text-white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        MeetSummary
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                        <Link to="/about" className={`hover:text-white transition-colors ${location.pathname === '/about' ? 'text-white' : ''}`}>
                            About
                        </Link>
                        <Link to="/history" className={`hover:text-white transition-colors ${location.pathname === '/history' ? 'text-white' : ''}`}>
                            History
                        </Link>
                    </div>

                    <div className="h-6 w-px bg-white/10 hidden md:block" />

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-300 hidden sm:block">
                                {user.name}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors ml-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
