import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setFilteredJobs, setSearchFilters } from '@/redux/jobSlice';
import{ BASE_URL } from '@/utils/constant';

const salaryRanges = [
    { value: '0-30000', label: '$0 - $30,000' },
    { value: '30000-60000', label: '$30,000 - $60,000' },
    { value: '60000-90000', label: '$60,000 - $90,000' },
    { value: '90000-120000', label: '$90,000 - $120,000' },
    { value: '120000-', label: '$120,000+' }
];

const experienceLevels = [
    { value: '1', label: 'Entry Level' },
    { value: '2', label: 'Intermediate' },
    { value: '3', label: 'Senior' },
    { value: '4', label: 'Expert' }
];

const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'remote', label: 'Remote' },
    { value: 'internship', label: 'Internship' }
];


const Jobs = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { filteredJobs, searchQuery } = useSelector((state) => state.job);
    const [filterJobs, setFilterJobs] = useState([]);
    const [viewType, setViewType] = useState('grid');
    const [sortBy, setSortBy] = useState('latest');
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState(searchQuery || '');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
        location: '',
        jobType: '',
        experienceLevel: '',
        salaryRange: '',
        industry: '',
        postedWithin: ''
    });

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    // Initialize filters and searchText from navigation state on mount
    useEffect(() => {
        if (location.state && location.state.searchFilters) {
            const sf = location.state.searchFilters;
            setFilters({
                location: sf.location || '',
                jobType: sf.jobType || '',
                experienceLevel: sf.experienceLevel || '',
                salaryRange: sf.salaryRange || '',
                industry: sf.industry || '',
                postedWithin: sf.postedWithin || ''
            });
            setSearchText(sf.query || '');
        }
    }, [location.state]);

    useEffect(() => {
        const applyFilters = () => {
            let filteredResults= [...filteredJobs];
            // Search text filter
            if (searchText) {
                filteredResults = filteredResults.filter(job => 
                    job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                    job.company?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                    job.location?.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            // Apply filters
            if (filters.jobType) {
                filteredResults = filteredResults.filter(job => 
                    job.jobType?.toLowerCase() === filters.jobType.toLowerCase()
                );
            }

            if (filters.experienceLevel) {
                filteredResults = filteredResults.filter(job =>
                    job.experienceLevel?.toString() === filters.experienceLevel
                );
            }

            if (filters.salaryRange) {
                const [min, max] = filters.salaryRange.split('-').map(Number);
                filteredResults = filteredResults.filter(job => {
                    const salary = Number(job.salary);
                    if (max) {
                        return salary >= min && salary <= max;
                    }
                    return salary >= min;
                });
            }

            // Apply sorting
            filteredResults.sort((a, b) => {
                switch (sortBy) {
                    case 'latest':
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case 'oldest':
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    case 'salary-high':
                        return b.salary - a.salary;
                    case 'salary-low':
                        return a.salary - b.salary;
                    default:
                        return 0;
                }
            });

            setFilterJobs(filteredResults);
        };

        applyFilters();
    }, [filteredJobs, searchText, filters, sortBy]);

    // Update the handleSearch function
    const handleSearch = () => {
        setIsLoading(true);
        try {
            // The filtering will be handled by the useEffect above
            // This function now just triggers a re-render
            setSearchText(searchText.trim());
        } finally {
            setIsLoading(false);
        }
    };

    // Update the quickFilter function
    const quickFilter = (tag) => {
        const tagLower = tag.toLowerCase();
        switch (tagLower) {
            case 'remote work':
                setFilters(prev => ({ ...prev, jobType: 'remote' }));
                break;
            case 'full-time':
                setFilters(prev => ({ ...prev, jobType: 'full-time' }));
                break;
            case 'tech jobs':
                setFilters(prev => ({ ...prev, industry: 'technology' }));
                break;
            case 'entry level':
                setFilters(prev => ({ ...prev, experienceLevel: '1' }));
                break;
            case 'urgent hiring':
                setSortBy('latest');
                break;
            default:
                break;
        }
    };

    // Single useEffect for fetching jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${BASE_URL}/api/v1/job/filter`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        query: searchText,
                        ...filters
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    setFilterJobs(data.jobs);
                    dispatch(setFilteredJobs(data.jobs));
                } else {
                    throw new Error(data.message || 'Failed to fetch jobs');
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, [dispatch, searchText, filters]);

    // Add search state

    const fetchJobs = async () => {
        try {
            const response = await fetch('/api/v1/job/jobs');
            const data = await response.json();

            if (data.success) {
                setFilterJobs(data.jobs);
                dispatch(setFilteredJobs(data.jobs));
            } else {
                console.error('Failed to fetch jobs:', data.message);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError('Failed to fetch jobs');
        } finally {
            setIsLoading(false);
        }
    };

    // Add search input in the return JSX
    return (
        <div className='min-h-screen bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Enhanced Search Section */}
                <div className='mb-8 bg-white p-6 rounded-xl shadow-lg'>
                    <h2 className='text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent mb-4'>
                        Discover Your Dream Career
                    </h2>
                    <div className='flex gap-4 mb-4'>
                        <div className='flex-1 relative'>
                            <input
                                type="text"
                                placeholder="Search your perfect role..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className='w-full p-4 pl-12 rounded-xl border-2 border-violet-100 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-300 text-lg'
                            />
                            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-violet-500'>
                                🔍
                            </span>
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className='px-6 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 font-semibold disabled:opacity-50'
                        >
                            {isLoading ? 'Searching...' : 'Search Jobs'}
                        </button>
                    </div>

                    {/* Quick Filters */}
                    <div className='flex flex-wrap gap-3'>
                        <span className='text-sm font-medium text-gray-500'>Popular Searches:</span>
                        {['Remote Work', 'Full-Time', 'Tech Jobs', 'Entry Level', 'Urgent Hiring'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => quickFilter(tag.toLowerCase())}
                                className='px-4 py-2 rounded-full bg-violet-50 text-violet-600 hover:bg-violet-100 transition-all duration-300 text-sm font-medium'
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='flex gap-6'>
                    {/* Enhanced Filter Section */}
                    <div className='w-1/4 space-y-6'>
                        <div className='bg-white p-6 rounded-xl shadow-lg'>
                            <h3 className='text-xl font-semibold mb-6 text-gray-800'>Advanced Filters</h3>

                            {/* Salary Range Slider */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium mb-2 text-gray-700'>Salary Range</label>
                                <select
                                    value={filters.salaryRange}
                                    onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                                    className='w-full p-3 rounded-lg border-2 border-gray-100 focus:border-violet-500 transition-all duration-300'
                                >
                                    <option value="">Any Salary</option>
                                    {salaryRanges.map(range => (
                                        <option key={range.value} value={range.value}>{range.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Experience Level */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium mb-2 text-gray-700'>Experience Level</label>
                                <div className='space-y-2'>
                                    {experienceLevels.map(level => (
                                        <label key={level.value} className='flex items-center space-x-2 cursor-pointer'>
                                            <input
                                                type="radio"
                                                name="experience"
                                                value={level.value}
                                                checked={filters.experienceLevel === level.value}
                                                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                                                className='text-violet-600 focus:ring-violet-500'
                                            />
                                            <span className='text-sm text-gray-600'>{level.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Job Type Tags */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium mb-2 text-gray-700'>Job Type</label>
                                <div className='flex flex-wrap gap-2'>
                                    {jobTypes.map(type => (
                                        <button
                                            key={type.value}
                                            onClick={() => setFilters({...filters, jobType: type.value})}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                                                filters.jobType === type.value
                                                    ? 'bg-violet-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-600'
                                            }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters Button */}
                            <button
                                onClick={() => setFilters({
                                    location: '',
                                    jobType: '',
                                    experienceLevel: '',
                                    salaryRange: '',
                                    industry: '',
                                    postedWithin: ''
                                })}
                                className='w-full py-3 text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-all duration-300 font-medium'
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                    {/* Main Content Section */}
                    <div className='flex-1'>
                        {/* Controls Bar */}
                        <div className='bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center'>
                            <div className='text-gray-600'>
                                Found <span className='font-semibold text-violet-600'>{filterJobs.length}</span> jobs
                            </div>
                            <div className='flex gap-4 items-center'>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className='bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5'
                                >
                                    <option value="latest">Latest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="salary-high">Highest Salary</option>
                                    <option value="salary-low">Lowest Salary</option>
                                </select>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => setViewType('grid')}
                                        className={`p-1.5 rounded ${viewType === 'grid' ? 'bg-violet-100 text-violet-600' : 'text-gray-400'}`}
                                    >
                                        □□□
                                    </button>
                                    <button
                                        onClick={() => setViewType('list')}
                                        className={`p-1.5 rounded ${viewType === 'list' ? 'bg-violet-100 text-violet-600' : 'text-gray-400'}`}
                                    >
                                        ☰
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Jobs Grid/List */}
                        {filterJobs.length === 0 ? (
                            <div className='text-center py-12 bg-white rounded-lg'>
                                <div className='text-6xl mb-4'>🔍</div>
                                <h3 className='text-lg font-medium text-gray-900'>No jobs found</h3>
                                <p className='text-gray-500'>Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            <div className={`${
                                viewType === 'grid' 
                                ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
                                : 'flex flex-col gap-4'
                            }`}>
                                {filterJobs.map((job, index) => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="w-full"
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Jobs;
