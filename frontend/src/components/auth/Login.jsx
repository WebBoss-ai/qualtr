import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, LogIn, Mail, Lock, Building, Briefcase } from 'lucide-react'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'

import img1 from '../../images/img_su_11.jpg'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const redirectTo = new URLSearchParams(location.search).get("redirect") || "/";

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                localStorage.setItem('loggedInUserId', res.data.user._id);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('loggedInUserRole', res.data.user.role);
                navigate(redirectTo);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
    
    useEffect(() => {
        if(user) {
            navigate("/");
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>Login to Qualtr | Access Top Agency and Brand Connections</title>
                <meta name="description" content="Log in to Qualtr to access a network of marketing agencies and brands. Stay connected and grow your business relationships." />
                <meta name="keywords" content="login to Qualtr, access agencies, brand connections, professional networking, marketing collaborations" />
            </Helmet>

            <div className="flex min-h-screen">
                {/* Left Section with Background Image */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hidden lg:flex lg:w-1/2 bg-cover bg-center p-12 items-center justify-center relative overflow-hidden"
                    style={{ backgroundImage: `url(${img1})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#004D4D] to-transparent opacity-70"></div>
                    <div className="relative z-10 max-w-md text-white">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">Connect. Collaborate. Grow.</h1>
                        <p className="text-xl opacity-90 mb-8">Seamlessly access your network of top agencies and brands to take your business to the next level</p>
                        <div className="flex space-x-4">
                            <div className="bg-[#006241] bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                                <h3 className="text-2xl font-semibold mb-2">50+</h3>
                                <p className="text-sm">Active Agencies</p>
                            </div>
                            <div className="bg-[#006241] bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
                                <h3 className="text-2xl font-semibold mb-2">1000+</h3>
                                <p className="text-sm">Loyal Brands</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Section with Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                            <p className="text-gray-600">Enter your details to access qualtr marketplace</p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <Input
                                        type="email"
                                        value={input.email}
                                        name="email"
                                        required
                                        onChange={changeEventHandler}
                                        placeholder="qualtr@gmail.com"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B5D3D3] focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <Input
                                        type="password"
                                        required
                                        value={input.password}
                                        name="password"
                        onChange={changeEventHandler}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B5D3D3] focus:border-transparent transition-all duration-200"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Role</Label>
                <RadioGroup className="flex items-center gap-6 mt-2">
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="radio"
                                            name="role"
                                            value="student"
                                            checked={input.role === 'student'}
                                            onChange={changeEventHandler}
                                            className="w-4 h-4 text-[#B5D3D3] border-gray-300 focus:ring-[#B5D3D3]"
                                        />
                                        <Label className="text-sm text-gray-600">Agency</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="radio"
                                            name="role"
                                            value="recruiter"
                                            checked={input.role === 'recruiter'}
                                            onChange={changeEventHandler}
                                            className="w-4 h-4 text-[#B5D3D3] border-gray-300 focus:ring-[#B5D3D3]"
                                        />
                                        <Label className="text-sm text-gray-600">Brand</Label>
                                    </div>
                                </RadioGroup>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-[#004D4D] hover:bg-[#003939] text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Please wait
                    </>
                ) : (
                    <>
                        <LogIn className="mr-2 h-5 w-5" />
                        Login
                    </>
                )}
            </Button>

            <div className="text-center mt-8">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#004D4D] hover:text-[#003939] font-medium transition-colors duration-200">
                        Sign up
                    </Link>
                </p>
            </div>
        </form>
    </motion.div>
</div>
</div>
</div>
    )
}

export default Login