import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Building2, Briefcase, LayoutDashboard, Plus, User } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const AdminNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector(store => store.auth);

    const logoutHandler = async () => {
        try {
            const response = await fetch('/api/v1/user/logout', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                localStorage.removeItem('token');
                dispatch(setUser(null));
                navigate('/login');
                toast.success('Logged out successfully');
            }
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const getNavItems = () => {
        const basePath = location.pathname.split('/')[2];
        
        const defaultItems = [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
            { label: 'Companies', icon: Building2, path: '/admin/companies' },
            { label: 'Manage Jobs', icon: Briefcase, path: '/admin/jobs' },
            { label: 'Post Job', icon: Plus, path: '/admin/jobs/create', highlight: true },
        ];

        if (basePath === 'companies') {
            return defaultItems.filter(item => 
                !['Manage Jobs', 'Post Job'].includes(item.label)
            );
        }
        
        if (basePath === 'jobs' && location.pathname.includes('/create')) {
            return defaultItems.filter(item => 
                !['Manage Jobs'].includes(item.label)
            );
        }

        return defaultItems;
    };

    return (
        <div className='bg-white/80 backdrop-blur-lg border-b border-violet-100 sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <Link to="/admin/dashboard" className='font-bold text-xl bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent'>
                    Admin Dashboard
                </Link>
    
                <div className='flex items-center gap-3'>
                    {getNavItems().map((item) => (
                        <Link key={item.path} to={item.path}>
                            <Button 
                                variant={location.pathname === item.path ? "default" : "ghost"} 
                                className={`gap-2 ${
                                    item.highlight 
                                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-700 hover:to-cyan-700' 
                                    : location.pathname === item.path 
                                    ? 'bg-violet-100 text-violet-700' 
                                    : 'hover:bg-violet-50'
                                }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                    
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user?.profile?.profilePhoto} />
                                </Avatar>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56" align="end">
                            <div className="space-y-1">
                                {/* Add Profile Link */}
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                                    onClick={() => navigate('/admin/profile')}
                                >
                                    <User className="w-4 h-4" />
                                    Update Profile
                                </Button>
                                
                                {/* Existing Logout Button */}
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={logoutHandler}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
};
export default AdminNavbar;