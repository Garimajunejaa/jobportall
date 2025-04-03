import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Menu, User2, X } from 'lucide-react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { motion } from 'framer-motion'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            // Add API call to backend logout endpoint
            const response = await fetch('/api/v1/user/logout', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                localStorage.removeItem('token');
                dispatch(setUser(null));
                navigate('/login');  // Changed from /auth to /login
                toast.success('Logged out successfully');
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'Browse', path: '/browse' }  // Updated path for Browse
    ];

    return (
        <div className='bg-gradient-to-r from-violet-50/90 via-teal-50/90 to-cyan-50/90 backdrop-blur-xl border-b border-violet-100/50 sticky top-0 z-50 shadow-sm'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-20 px-6'>
                <Link to="/" className='flex items-center gap-2 group'>
                    <motion.span 
                        className='text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent'
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        JobPortal
                    </motion.span>
                </Link>

                <button
                    className="md:hidden text-sky-600 p-2 rounded-lg hover:bg-sky-50 transition-all duration-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <motion.div
                        animate={{ rotate: isMenuOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </motion.div>
                </button>

                <div className={`flex items-center gap-8 ${isMenuOpen ? 'absolute top-20 left-0 right-0 bg-white/95 p-6 shadow-lg border-b border-sky-100 backdrop-blur-xl md:relative md:top-0 md:bg-transparent md:shadow-none md:border-none' : 'hidden md:flex'}`}>
                    <motion.ul 
                        className='flex flex-col md:flex-row items-center gap-8 text-[15px] font-medium'
                        variants={{
                            hidden: { opacity: 0, y: -20 },
                            show: {
                                opacity: 1,
                                y: 0,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        initial="hidden"
                        animate="show"
                    >
                        {['Home', 'Jobs', 'Browse'].map((item, index) => (
                            <motion.li
                                key={item}
                                variants={{
                                    hidden: { opacity: 0, y: -20 },
                                    show: { opacity: 1, y: 0 }
                                }}
                            >
                                <Link 
                                    to={item === 'Home' ? '/' : 
                                        item === 'Jobs' ? '/jobs' : 
                                        item === 'Browse' ? '/jobs' : '/'}
                                    className="relative text-gray-700 hover:text-sky-600 transition-colors duration-300 group"
                                >
                                    {item}
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-sky-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                </Link>
                            </motion.li>
                        ))}
                    </motion.ul>

                    {user ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="cursor-pointer"
                                >
                                    <Avatar className="h-10 w-10 ring-2 ring-violet-200 ring-offset-2 hover:ring-violet-300 transition-all duration-300">
                                        <AvatarImage src={user?.profile?.profilePhoto} />
                                    </Avatar>
                                </motion.div>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-3 bg-white/90 backdrop-blur-xl border-2 border-violet-100 shadow-xl rounded-2xl">
                                <div className='space-y-2'>
                                    <Button
                                        variant="ghost"
                                        onClick={() => navigate('/profile')}
                                        className='w-full justify-start gap-3 text-[15px] font-medium hover:bg-violet-50 hover:text-violet-600 text-gray-700 rounded-xl transition-all duration-300'
                                    >
                                        <User2 className='w-4 h-4' />
                                        Profile
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className='w-full justify-start gap-3 text-[15px] font-medium hover:bg-rose-50 hover:text-rose-600 text-gray-700 rounded-xl transition-all duration-300'
                                        onClick={logoutHandler}
                                    >
                                        <LogOut className='w-4 h-4' />
                                        Logout
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <Link to="/login">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {/* Update the sign in button gradient */}
                                <Button className='bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white text-[15px] font-medium px-8 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300'>
                                    Sign In
                                </Button>
                            </motion.div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar