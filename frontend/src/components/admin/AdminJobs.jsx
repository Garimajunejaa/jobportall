import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Briefcase, Plus, Search, SlidersHorizontal, MapPin, Building2, Clock, Users, RefreshCw } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { BASE_URL } from '@/utils/constant'
import { setAllJobs, setAllAdminJobs } from '@/redux/jobSlice'
import { toast } from 'sonner'
// Replace Navbar import with AdminNavbar
import AdminNavbar from '../shared/AdminNavbar'
import { useNavigate } from 'react-router-dom'  // Add this import at the top


import { JOB_API_END_POINT } from '@/utils/constant'

const AdminJobs = () => {
    const navigate = useNavigate();  // Add this hook
    const dispatch = useDispatch();
    const { allJobs = [], allAdminJobs = [] } = useSelector(store => store.job);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch jobs function
    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/job/getadminjobs`, {
                withCredentials: true
            });
            
            if (res.data.success) {
                const jobsWithApplications = res.data.jobs.map(job => ({
                    ...job,
                    applicationsCount: job.applications?.length || 0
                }));
                
                dispatch(setAllJobs(jobsWithApplications));
                dispatch(setAllAdminJobs(jobsWithApplications));
                setFilteredJobs(jobsWithApplications);
                toast.success("Jobs loaded successfully");
            }
        } catch (error) {
            console.error("Job fetch error:", error);
            toast.error(error.response?.data?.message || "Failed to load jobs");
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchJobs();
    }, []);

    // Enhanced filter and sort function
    useEffect(() => {
        if (!allAdminJobs?.length) return;
        
        let result = [...allAdminJobs];

        // Search filter
        if (searchQuery) {
            result = result.filter(job => 
                job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Job type filter
        if (filterType !== 'all') {
            result = result.filter(job => job.jobType?.toLowerCase() === filterType.toLowerCase());
        }

        // Enhanced sorting
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'most-applications':
                result.sort((a, b) => (b.applications?.length || 0) - (a.applications?.length || 0));
                break;
            case 'least-applications':
                result.sort((a, b) => (a.applications?.length || 0) - (b.applications?.length || 0));
                break;
            case 'salary-high':
                result.sort((a, b) => (b.salary || 0) - (a.salary || 0));
                break;
            case 'salary-low':
                result.sort((a, b) => (a.salary || 0) - (b.salary || 0));
                break;
            default:
                break;
        }

        setFilteredJobs(result);
    }, [allAdminJobs, searchQuery, filterType, sortBy]);

    // Debug logs
    console.log("All Admin Jobs:", allAdminJobs);
    console.log("Filtered Jobs:", filteredJobs);

    // Update the job card to show applications count
    const renderJobCard = (job) => (
        <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <Building2 className="w-4 h-4" />
                        <span>{job.company?.name || 'Company Name'}</span>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.jobType === 'full-time' ? 'bg-green-100 text-green-700' :
                    job.jobType === 'part-time' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                }`}>
                    {job.jobType}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{job.applications?.length || 0} Applications</span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <Button 
                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                    className="bg-violet-100 text-violet-700 hover:bg-violet-200 flex items-center gap-2"
                >
                    <Users className="w-4 h-4" />
                    View Applicants ({job.applications?.length || 0})
                </Button>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-cyan-50">
            <AdminNavbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header with Refresh Button */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-violet-600" />
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                                Manage Jobs
                            </h1>
                        </div>
                        <Button 
                            onClick={fetchJobs} 
                            variant="outline" 
                            className="border-violet-200 hover:bg-violet-50"
                            disabled={isLoading}
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                    <p className="text-gray-500 ml-11">
                        Total Jobs: <span className="font-medium text-violet-600">{allJobs?.length || 0}</span>
                    </p>
                </motion.div>

                {/* Enhanced Controls */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-6"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    className="pl-10 border-gray-200 focus:ring-2 focus:ring-violet-500 w-full"
                                    placeholder="Search jobs, companies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            
                            {/* Enhanced Job Type Filter */}
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[140px] border-gray-200">
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Filter by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="full-time">Full Time</SelectItem>
                                        <SelectItem value="part-time">Part Time</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                        <SelectItem value="remote">Remote</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {/* Enhanced Sort Options */}
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px] border-gray-200">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="most-applications">Most Applications</SelectItem>
                                        <SelectItem value="least-applications">Least Applications</SelectItem>
                                        <SelectItem value="salary-high">Highest Salary</SelectItem>
                                        <SelectItem value="salary-low">Lowest Salary</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <Link to="/admin/jobs/create">
                            <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white w-full md:w-auto">
                                <Plus className="w-5 h-5 mr-2" />
                                Post New Job
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {filteredJobs.map(job => renderJobCard(job))}
                </div>
            </div>
        </div>
    );
};
// Fix the export statement
export default AdminJobs;