import React, { useEffect, useState } from 'react'
import AdminNavbar from '../shared/AdminNavbar'
import { JOB_API_END_POINT,} from '@/utils/constant'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
    Building2, Briefcase, Users, TrendingUp, 
    Target, Clock, Award, Bell, BarChart3, // Changed ChartBar to BarChart3
    FileSpreadsheet, UserCheck, AlertCircle
} from 'lucide-react'
import axios from 'axios'
import { setAllJobs } from '@/redux/jobSlice'
import { BASE_URL } from '@/utils/constant'
import { toast } from 'sonner'

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);
    const { allJobs } = useSelector(store => store.job);
    const [recentApplications, setRecentApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, applicationsRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/v1/job/getadminjobs`, { withCredentials: true }),
                    axios.get(`${BASE_URL}/api/v1/job/recent-applications`, { withCredentials: true })
                ]);
                
                if (jobsRes.data.success) {
                    dispatch(setAllJobs(jobsRes.data.jobs));
                }
                if (applicationsRes.data.success) {
                    setRecentApplications(applicationsRes.data.applications);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [dispatch]);

    const stats = [
        {
            title: "Total Companies",
            value: companies?.length || 0,
            icon: Building2,
            color: "from-blue-500 to-blue-700",
            link: "/admin/companies",
            description: "View and manage all registered companies"
        },
        {
            title: "Active Jobs",
            value: allJobs?.length || 0,
            icon: Briefcase,
            color: "from-emerald-500 to-emerald-700",
            link: "/admin/jobs",
            description: "Manage your posted job listings"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <AdminNavbar />
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Welcome Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                        Welcome to Your Dashboard
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Streamline your recruitment process and manage your job postings efficiently
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {stats.map((stat, index) => (
                        <Link key={index} to={stat.link}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-slate-100"
                            >
                                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${stat.color} mb-6`}>
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                                    {stat.title}
                                </h3>
                                <p className="text-4xl font-bold text-slate-900 mb-4">
                                    {stat.value}
                                </p>
                                <p className="text-slate-600">{stat.description}</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-lg p-8 border border-slate-100"
                >
                    <h2 className="text-2xl font-bold mb-6 flex items-center text-slate-800">
                        <Target className="w-6 h-6 mr-3 text-blue-600" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link to="/admin/jobs/create">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="group bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <Briefcase className="w-10 h-10 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Post New Job</h3>
                                <p className="text-blue-100">Create and publish a new job listing</p>
                            </motion.div>
                        </Link>
                        <Link to="/admin/companies">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="group bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-6 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <Building2 className="w-10 h-10 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Manage Companies</h3>
                                <p className="text-emerald-100">View and update company information</p>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;

const fetchDashboardData = async () => {
    try {
        const res = await axios.get(`${JOB_API_END_POINT}/dashboard`, API_CONFIG);
        
        if (res.data.success) {
            // Process dashboard data
            setDashboardData(res.data);
        }
    } catch (error) {
        console.error("Dashboard data fetch error:", error);
        toast.error(error.response?.data?.message || "Failed to load dashboard data");
    }
};
