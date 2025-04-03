import React, { useState, useEffect } from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button'
import { motion } from 'framer-motion'
import { Filter, Search } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { setAllJobs } from '@/redux/jobSlice';

const LatestJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const { allJobs } = useSelector(store => store.job);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [salaryRange, setSalaryRange] = useState([0, 100]);
    const [visibleJobs, setVisibleJobs] = useState(6);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/job/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }

                const data = await response.json();
                if (data.success) {
                    dispatch(setAllJobs(data.jobs));
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [dispatch]);

    // If no user, don't render the latest jobs
    if (!user) return null;

    const jobTypes = ['all', 'full-time', 'part-time', 'contract', 'remote', 'internship'];

    const filteredJobs = allJobs.filter(job => {
        const matchesFilter = filter === 'all' || job.jobType.toLowerCase() === filter;
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSalary = job.salary >= salaryRange[0] && job.salary <= salaryRange[1];
        
        return matchesFilter && matchesSearch && matchesSalary;
    });

    const loadMore = () => {
        setVisibleJobs(prev => prev + 6);
    };

    return (
        <div className='max-w-7xl mx-auto my-20 px-4'>
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    <div className='flex flex-col gap-6'>
                        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                            <h1 className='text-4xl font-bold'>
                                <span className='bg-gradient-to-r from-violet-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent'>
                                    Latest & Top 
                                </span> 
                                <span> Jobs</span>
                            </h1>
                            
                            <div className='flex items-center gap-4'>
                                <div className='relative'>
                                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
                                    <input
                                        type="text"
                                        placeholder="Search jobs..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 w-64'
                                    />
                                </div>
                            
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="gap-2">
                                            <Filter className="w-4 h-4" />
                                            Filters
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-4">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">Salary Range (LPA)</h4>
                                                <div className="flex gap-2 items-center">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={salaryRange[1]}
                                                        onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value)])}
                                                        className="w-full"
                                                    />
                                                    <span className="text-sm text-gray-600">{salaryRange[1]}L</span>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    
                        <div className='flex flex-wrap gap-2'>
                            {jobTypes.map(type => (
                                <Button
                                    key={type}
                                    variant="outline"
                                    onClick={() => setFilter(type)}
                                    className={`
                                        capitalize transition-all duration-300
                                        ${filter === type 
                                            ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-transparent' 
                                            : 'hover:border-violet-500 hover:text-violet-600'
                                        }
                                    `}
                                >
                                    {type.replace('-', ' ')}
                                </Button>
                            ))}
                        </div>
                    </div>
                
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredJobs.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                                <p className="text-gray-500">Try adjusting your search filters</p>
                            </div>
                        ) : (
                            filteredJobs.slice(0, visibleJobs).map((job, index) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <LatestJobCards job={job} />
                                </motion.div>
                            ))
                        )}
                    </div>
                
                    {filteredJobs.length > visibleJobs && (
                        <div className='text-center mt-10'>
                            <Button 
                                onClick={loadMore}
                                variant="outline" 
                                className="bg-white hover:bg-violet-50 hover:text-violet-600 hover:border-violet-300"
                            >
                                Load More Jobs
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LatestJobs;