import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, User, Mail, Phone, Lock, Upload, Building, Briefcase } from 'lucide-react'
import { Helmet } from 'react-helmet'
import img1 from '../../images/img_su_11.jpg'
import { motion } from 'framer-motion'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
                timeout: 10000,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setTimeout(() => {
            dispatch(setLoading(false));
        }, 3000);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate])

    return (
        <div className="min-h-screen flex">
            <Helmet>
                <title>Join Qualtr | Sign Up to Connect with Brands & Agencies</title>
                <meta name="description" content="Create your Qualtr account and connect with leading marketing agencies and brands. Start your journey today!" />
                <meta name="keywords" content="join Qualtr, sign up, connect with agencies, brand collaborations, account registration, marketing platform" />
            </Helmet>

            {/* Left Section with Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full mb-10 max-w-xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mt-10 text-gray-900">Create Your Account</h2>
                        <p className="text-gray-600 mt-2">Join Qualtr and start connecting today</p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    id="fullname"
                                    type="text"
                                    name="fullname"
                                    required
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    placeholder="John Doe"
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B5D3D3] focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    placeholder="you@example.com"
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B5D3D3] focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    id="phoneNumber"
                                    type="text"
                                    name="phoneNumber"
                                    required
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    placeholder="+91-8167080111"
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B5D3D3] focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    placeholder="********"
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B5D3D3] focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Select Role</Label>
                            <RadioGroup className="space-y-1">

                                <div className="flex items-center">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer mr-2"
                                        style={{ width: '16px', height: '16px' }} // Inline style for size
                                    />
                                    <Label htmlFor="r1" className="text-gray-800 text-sm font-medium">
                                        Agency - <span className="font-normal text-[#495057]">Offer services and take on projects</span>
                                    </Label>
                                </div>

                                <div className="flex items-center">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer mr-2"
                                        style={{ width: '16px', height: '16px' }} // Inline style for size
                                    />
                                    <Label htmlFor="r2" className="text-gray-800 text-sm font-medium">
                                        Brand - <span className="font-normal text-[#495057]">Outsource projects and connect with agencies</span>
                                    </Label>
                                </div>

                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file" className="text-sm font-medium text-gray-700">Upload Logo</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="file"
                                    type="file"
                                    required
                                    accept="image/*"
                                    onChange={changeFileHandler}
                                    className="hidden"
                                />
                                <Label htmlFor="file" className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                                    <Upload className="mr-2" size={18} />
                                    Choose file
                                </Label>
                                <span className="text-sm text-gray-500 truncate max-w-[200px]">
                                    {input.file ? input.file.name : "No file chosen"}
                                </span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 bg-[#004D4D] hover:bg-[#003939] text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#004D4D] hover:text-[#003939] font-medium transition-colors duration-200">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section with Background Image */}
            <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hidden lg:flex lg:w-1/2 bg-cover bg-center p-12 items-center justify-center relative overflow-hidden"
                    style={{ backgroundImage: `url(${img1})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#004D4D] to-transparent opacity-70"></div>
                    <div className="relative z-10 max-w-md text-white">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">Expand Your Network</h1>
                        <p className="text-xl opacity-90 mb-8">Connect with top agencies and brands to unlock new business opportunities</p>
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

        </div>
    )
}

export default Signup