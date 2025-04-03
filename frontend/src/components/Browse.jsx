import React from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery, setSearchFilters } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion } from 'framer-motion'
import { Search, MapPin, Briefcase } from 'lucide-react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom';

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const handleError = (error) => {
            setHasError(true);
            setError(error);
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, []);

    if (hasError) {
        return (
            <div className="text-center py-10">
                <h2 className="text-red-600 font-bold text-xl">Something went wrong!</h2>
                <p className="text-gray-600 mt-2">{error?.message || 'An unexpected error occurred'}</p>
                <Button 
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-violet-600 hover:bg-violet-700 text-white"
                >
                    Refresh Page
                </Button>
            </div>
        );
    }

    return children;
};

const Browse = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery, searchFilters } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Group jobs by category with proper type checking
    const jobCategories = React.useMemo(() => {
        const categories = {
            technology: [],
            marketing: [],
            design: [],
            finance: [],
            other: []
        };

        allJobs.forEach(job => {
            if (!job) return;
            
            const category = job.category ? job.category.toLowerCase() : 'other';
            if (categories.hasOwnProperty(category)) {
                categories[category].push(job);
            } else {
                categories.other.push(job);
            }
        });

        return categories;
    }, [allJobs]);

    // Get featured jobs with proper checks
    const featuredJobs = React.useMemo(() => {
        return allJobs
            .filter(job => job && job.isFeatured)
            .slice(0, 6);
    }, [allJobs]);

    // Add loading state
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (allJobs.length > 0) {
            setIsLoading(false);
        }
    }, [allJobs]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-violet-600 font-medium">Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50">
                <Navbar />
                <div className='max-w-7xl mx-auto my-10 px-4'>
                    {/* Featured Jobs Section */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                            Featured Jobs
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredJobs.map((job, index) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Job job={job} />
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Job Categories with error handling */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                            Browse by Category
                        </h2>
                        {Object.entries(jobCategories).map(([category, jobs]) => (
                            jobs.length > 0 && (
                                <div key={category} className="mb-12">
                                    <h3 className="text-xl font-semibold mb-4 capitalize text-gray-800">
                                        {category} ({jobs.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {jobs.slice(0, 3).map((job, index) => (
                                            <motion.div
                                                key={job._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Job job={job} />
                                            </motion.div>
                                        ))}
                                    </div>
                                    {jobs.length > 3 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <Button
                                                onClick={() => navigate('/jobs', { 
                                                    state: { category: category } 
                                                })}
                                                className="mt-6 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white"
                                            >
                                                View All {category} Jobs
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>
                            )
                        ))}
                    </section>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Browse