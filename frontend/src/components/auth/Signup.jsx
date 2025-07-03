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
import { setLoading } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        if (e.target.name === 'password') {
            checkPasswordStrength(e.target.value);
        }
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        
        try {
            dispatch(setLoading(true));
            
            // Only validate required fields: fullname, email, and role
            if (!input.fullname || !input.email || !input.role) {
                toast.error("Please fill required fields: Name, Email, and Role");
                return;
            }

            // Create request data with required fields
            const userData = {
                fullname: input.fullname.trim(),
                email: input.email.trim().toLowerCase(),
                role: input.role,
                // Add optional fields only if they exist
                ...(input.password && { password: input.password }),
                ...(input.phoneNumber?.trim() && { phoneNumber: input.phoneNumber.trim() })
            };

            const response = await axios.post(`${USER_API_END_POINT}/register`, userData, {
                headers: { 
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response?.data?.success) {
                toast.success(response.data.message || "Registration successful!");
                navigate("/login");
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.code === 'ERR_NETWORK') {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 bg-white shadow-xl rounded-2xl p-8 my-10'>
                    <h1 className='text-3xl font-bold text-gray-800 text-center mb-8'>Create Your Account</h1>
                    <div className='space-y-2 mb-6'>
                        <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="John Doe"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='space-y-2 mb-6'>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="patel@gmail.com"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='space-y-2 mb-6'>
                        <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="8080808080"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='space-y-2 mb-6'>
                        <Label className="text-sm font-medium text-gray-700">Password</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        
                        <div className="mt-2">
                            <div className="flex gap-1 h-1">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-full ${
                                            i < passwordStrength
                                                ? 'bg-green-500'
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Password strength: {
                                    ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength - 1] || 'Too weak'
                                }
                            </p>
                        </div>
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
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    <Button 
                        disabled={loading}
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg transition-all duration-200 my-4"
                    >
                        {loading ? (
                            <><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</>
                        ) : (
                            'Sign Up'
                        )}
                    </Button>
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Signup