import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import { Helmet } from 'react-helmet';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading,user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const redirectTo = new URLSearchParams(location.search).get("redirect") || "/"; // Default to home page if no redirect parameter

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
                withCredentials: true // This will automatically send the cookie
            });
            
            if (res.data.success) {
                // Save user data in redux
                dispatch(setUser(res.data.user));
                // Store token in localStorage
                localStorage.setItem('loggedInUserId', res.data.user._id);
                localStorage.setItem('token', res.data.token); // Corrected this line
                localStorage.setItem('loggedInUserRole', res.data.user.role);
                // Navigate after successful login
                // navigate("/");
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
    
    
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div>
            <Helmet>
  <title>Login to Qualtr | Access Top Agency and Brand Connections</title>
  <meta name="description" content="Log in to Qualtr to access a network of marketing agencies and brands. Stay connected and grow your business relationships." />
  <meta name="keywords" content="login to Qualtr, access agencies, brand connections, professional networking, marketing collaborations" />
</Helmet>

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className='flex items-center justify-center max-w-7xl mx-auto w-full'>
        <form onSubmit={submitHandler} className='w-full md:w-1/2 border border-black-600 rounded-md p-6 bg-white shadow-lg'>
            <h1 className='font-bold text-xl mb-5 text-green-600'>Login to <span style={{color:'black'}}>Qualtr</span></h1>
            <div className='my-4'>
                <Label>Email</Label>
                <Input
                    type="email"
                    value={input.email}
                    name="email"
                    onChange={changeEventHandler}
                    placeholder="qualtr@gmail.com"
                    className="border-black-600"
                />
            </div>

            <div className='my-4'>
                <Label>Password</Label>
                <Input
                    type="password"
                    value={input.password}
                    name="password"
                    onChange={changeEventHandler}
                    placeholder="Enter your password"
                    className="border-black-600"
                />
            </div>
            <div className='flex items-center justify-between'>
                <RadioGroup className="flex items-center gap-4 my-5">
                    <div className="flex items-center space-x-2">
                        <Input
                            type="radio"
                            name="role"
                            value="student"
                            checked={input.role === 'student'}
                            onChange={changeEventHandler}
                            className="cursor-pointer border-black-600"
                        />
                        <Label>Agency</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input
                            type="radio"
                            name="role"
                            value="recruiter"
                            checked={input.role === 'recruiter'}
                            onChange={changeEventHandler}
                            className="cursor-pointer border-black-600"
                        />
                        <Label>Brand</Label>
                    </div>
                </RadioGroup>
            </div>
            {
                loading ? <Button className="w-full my-4 bg-green-600 text-white"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4 bg-green-600 text-white">Login</Button>
            }
            <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-green-600'>Signup</Link></span>
        </form>
    </div>
</div>

        </div>
    )
}

export default Login