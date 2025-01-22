import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import { Home, FileText, Users, Menu, LogOut, LogIn } from 'lucide-react'; // Icons from lucide-react

const Navbar2 = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(`${MARKETER_API_END_POINT}/auth/status`, {
                    withCredentials: true,
                });
                setIsLoggedIn(response.data.loggedIn);
            } catch (error) {
                console.error('Error checking login status:', error);
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${MARKETER_API_END_POINT}/auth/logout`, {}, { withCredentials: true });
            setIsLoggedIn(false);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            {/* Top Navbar */}
            <nav className="top-0 left-0 right-0 bg-white shadow-md z-50">
                <div className="container mx-auto flex justify-between items-center px-4 py-4">
                    <Link to="/" className="text-xl font-bold text-black-600">
                        Qualtr
                    </Link>
                    <ul className="hidden md:flex space-x-6 items-center">
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <Link to="/posts" className="text-gray-700 hover:text-black-600">
                                        Posts
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/founder/profiles" className="text-gray-700 hover:text-black-600">
                                        Founders
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/founder-profile/update" className="text-gray-700 hover:text-black-600">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-700 hover:text-black-600 border border-gray-300 px-4 py-1 rounded"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/founder/login" className="text-gray-700 hover:text-black-600">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/founder/register" className="text-gray-700 hover:text-black-600">
                                        Signup
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <button
                        className="md:hidden text-gray-700 hover:text-black-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="bg-white shadow-md md:hidden px-4 py-2">
                        <ul className="space-y-3">
                            {isLoggedIn ? (
                                <>
                                    <li>
                                        <Link to="/posts" className="text-gray-700 hover:text-black-600">
                                            Posts
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/founder/profiles" className="text-gray-700 hover:text-black-600">
                                            Founders
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/founder-profile/update" className="text-gray-700 hover:text-black-600">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-700 hover:text-black-600"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/founder/login" className="text-gray-700 hover:text-black-600">
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/founder/register" className="text-gray-700 hover:text-black-600">
                                            Signup
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </nav>

            {/* Bottom Navbar */}
            <nav className="fixed md:hidden bottom-0 left-0 right-0 bg-white shadow-t-md z-50">
                <ul className="flex justify-around items-center py-2">
                    <li>
                        <Link to="/posts" className="flex flex-col items-center text-gray-700 hover:text-black-600">
                            <FileText size={24} />
                            <span className="text-sm">Posts</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/founder/profiles" className="flex flex-col items-center text-gray-700 hover:text-black-600">
                            <Users size={24} />
                            <span className="text-sm">Founders</span>
                        </Link>
                    </li>
                    {isLoggedIn && (
                        <li>
                            <Link
                                to="/founder-profile/update"
                                className="flex flex-col items-center text-gray-700 hover:text-black-600"
                            >
                                <Home size={24} />
                                <span className="text-sm">Dashboard</span>
                            </Link>
                        </li>
                    )}
                    <li>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="flex flex-col items-center text-gray-700 hover:text-black-600"
                            >
                                <LogOut size={24} />
                                <span className="text-sm">Logout</span>
                            </button>
                        ) : (
                            <Link
                                to="/founder/login"
                                className="flex flex-col items-center text-gray-700 hover:text-black-600"
                            >
                                <LogIn size={24} />
                                <span className="text-sm">Login</span>
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Navbar2;