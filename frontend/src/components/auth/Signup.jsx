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
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <Helmet>
  <title>Join Qualtr | Sign Up to Connect with Brands & Agencies</title>
  <meta name="description" content="Create your Qualtr account and connect with leading marketing agencies and brands. Start your journey today!" />
  <meta name="keywords" content="join Qualtr, sign up, connect with agencies, brand collaborations, account registration, marketing platform" />
</Helmet>

            <div className="w-full mt-16 mb-16 max-w-xl px-6 py-8 bg-white l rounded-xl">
                <h1 className="text-xl font-bold text-green-600 mb-6 text-center">Sign Up to Qualtr</h1>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                id="fullname"
                                type="text"
                                name="fullname"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                placeholder="John Doe"
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="you@example.com"
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                placeholder="+91-8167080111"
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                value={input.password}
                                onChange={changeEventHandler}
                                placeholder="********"
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="p-4 border rounded bg-[#f8f9fa]">
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
                                accept="image/*"
                                onChange={changeFileHandler}
                                className="hidden"
                            />
                            <Label htmlFor="file" className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md  text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                <Upload className="mr-2" size={18} />
                                Choose file
                            </Label>
                            <span className="text-sm text-gray-500">
                                {input.file ? input.file.name : "No file chosen"}
                            </span>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 border border-transparent rounded-md  text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                <div className="text-center text-sm mt-6">
                    <span className="text-gray-600">Already have an account?</span>{' '}
                    <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Signup