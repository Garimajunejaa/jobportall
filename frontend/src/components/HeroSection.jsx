import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchedQuery, setSearchFilters } from '../redux/jobSlice'
import { Button } from './ui/button'
import { Search, MapPin, Briefcase, X, Clock, TrendingUp, Building, Code2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const popularSearches = [
    { title: 'Software Engineer', icon: <Briefcase className="w-4 h-4" />, color: 'from-blue-100 to-indigo-100' },
    { title: 'Web Developer', icon: <Briefcase className="w-4 h-4" />, color: 'from-violet-100 to-purple-100' },
    { title: 'Data Scientist', icon: <Briefcase className="w-4 h-4" />, color: 'from-teal-100 to-cyan-100' },
    { title: 'Product Manager', icon: <Briefcase className="w-4 h-4" />, color: 'from-rose-100 to-pink-100' },
    { title: 'UI/UX Designer', icon: <Briefcase className="w-4 h-4" />, color: 'from-amber-100 to-orange-100' }
];

const popularLocations = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune'];
const popularTypes = ['Full Time', 'Part Time', 'Remote', 'Internship', 'Contract'];

const MAX_RECENT_SEARCHES = 5;

// Add these constants at the top after existing ones
const salaryRanges = [
    { label: 'Any Salary', value: '' },
    { label: '0-3 LPA', value: '0-3' },
    { label: '3-6 LPA', value: '3-6' },
    { label: '6-10 LPA', value: '6-10' },
    { label: '10-15 LPA', value: '10-15' },
    { label: '15+ LPA', value: '15+' }
];

// Update the experienceLevels constant
const experienceLevels = [
    { label: 'Any Experience', value: '' },
    { label: 'Entry Level', value: 'entry' },
    { label: 'Junior Level', value: 'junior' },
    { label: 'Mid Level', value: 'mid' },
    { label: 'Senior Level', value: 'senior' },
    { label: 'Lead/Manager', value: 'lead' },
    { label: 'Executive Level', value: 'executive' }
];

// Add new search categories
const searchCategories = [
    { id: 'all', label: 'All', icon: <Search className="w-4 h-4" /> },
    { id: 'jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'companies', label: 'Companies', icon: <Building className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Code2 className="w-4 h-4" /> }
];

// Add trending keywords
const trendingKeywords = ['Remote', 'AI/ML', 'Web3', 'Blockchain', 'DevOps', 'Cloud'];

const HeroSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Normalization mappings for filters
    const normalizeJobType = (type) => {
        const map = {
            'full time': 'full-time',
            'part time': 'part-time',
            'remote': 'remote',
            'internship': 'internship',
            'contract': 'contract'
        };
        return map[type.toLowerCase()] || '';
    };

    const normalizeSalaryRange = (range) => {
        const map = {
            '0-3': '0-30000',
            '3-6': '30000-60000',
            '6-10': '60000-90000',
            '10-15': '90000-120000',
            '15+': '120000-'
        };
        return map[range] || '';
    };

    const normalizeExperienceLevel = (level) => {
        const map = {
            'entry': 'entry',
            'junior': 'intermediate',
            'mid': 'intermediate',
            'senior': 'senior',
            'lead': 'expert',
            'executive': 'expert',
            '': ''
        };
        return map[level] || '';
    };

    // Add these new state variables with the existing ones
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');  // Add this line
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('recentSearches');
        return saved ? JSON.parse(saved) : [];
    });
    const [showSuggestions, setShowSuggestions] = useState(false);
    // Add these missing state variables
    const [salaryRange, setSalaryRange] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [sortBy, setSortBy] = useState('relevance');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    useEffect(() => {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }, [recentSearches]);

    // Update handleSearch function to include all filters
    // First, add the clearFilters function
    const clearFilters = () => {
        setSearchTerm('');
        setLocation('');
        setJobType('');
        setSalaryRange('');
        setExperienceLevel('');
        setSortBy('relevance');
        dispatch(setSearchedQuery(''));
        dispatch(setSearchFilters({
            location: '',
            jobType: '',
            salaryRange: '',
            experienceLevel: '',
            sortBy: 'relevance',
            query: ''
        }));
        handleSearch('', '', '', '', '', 'relevance');
    };

    // Fix the handleSearch function
    const handleSearch = (query = searchTerm, loc = location, type = jobType) => {
        setIsLoading(true);
        try {
            const searchFilters = {
                query: query,
                location: loc,
                jobType: normalizeJobType(type),
                salaryRange: normalizeSalaryRange(salaryRange),
                experienceLevel: normalizeExperienceLevel(experienceLevel),
                sortBy
            };

            // Update Redux state with all filters
            dispatch(setSearchFilters(searchFilters));
            dispatch(setSearchedQuery(query));

            // Save to recent searches with complete filter state
            if (query || loc || type || salaryRange || experienceLevel) {
                const newSearches = [
                    { 
                        query, 
                        filters: searchFilters,
                        timestamp: Date.now() 
                    },
                    ...recentSearches.filter(s => 
                        s.query !== query || 
                        s.filters.location !== loc
                    )
                ].slice(0, MAX_RECENT_SEARCHES);
                setRecentSearches(newSearches);
                localStorage.setItem('recentSearches', JSON.stringify(newSearches));
            }

            // Navigate to jobs page
            navigate('/jobs', { 
                state: { searchFilters } 
            });
            
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
            setShowSuggestions(false);
        }
    };

    // Remove the standalone AnimatePresence section and move it inside the return statement
    // Remove duplicate advanced filters section
    <AnimatePresence>
        {showAdvancedFilters && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <select
                    value={salaryRange}
                    onChange={(e) => {
                        setSalaryRange(e.target.value);
                        handleSearch(searchTerm, location, jobType);
                    }}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 border-2 border-sky-100 focus:border-sky-400 text-gray-700"
                >
                    {salaryRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                            {range.label}
                        </option>
                    ))}
                </select>

                <select
                    value={experienceLevel}
                    onChange={(e) => {
                        setExperienceLevel(e.target.value);
                        handleSearch(searchTerm, location, jobType);
                    }}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 border-2 border-sky-100 focus:border-sky-400 text-gray-700"
                >
                    {experienceLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                            {level.label}
                        </option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        handleSearch(searchTerm, location, jobType);
                    }}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 border-2 border-sky-100 focus:border-sky-400 text-gray-700"
                >
                    <option value="relevance">Most Relevant</option>
                    <option value="recent">Most Recent</option>
                    <option value="salary-high">Highest Salary</option>
                    <option value="salary-low">Lowest Salary</option>
                </select>
            </motion.div>
        )}
    </AnimatePresence>
    const clearSearch = () => {
        setSearchTerm('');
        setLocation('');
        setJobType('');
        dispatch(setSearchedQuery(''));
        dispatch(setSearchFilters({ location: '', jobType: '' }));
    };

    const hasFilters = searchTerm || location || jobType;

    // Add new search suggestions
    const jobSuggestions = [
        { icon: '💼', label: 'Popular Jobs', items: ['Software Engineer', 'Product Manager', 'Data Scientist'] },
        { icon: '🌟', label: 'Trending Skills', items: ['React.js', 'Python', 'AWS', 'Machine Learning'] },
        { icon: '🏢', label: 'Top Companies', items: ['Google', 'Microsoft', 'Amazon', 'Meta'] }
    ];
    
    // Update the return statement
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-teal-50 relative overflow-hidden font-['Poppins']">
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-20" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white/50" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center space-y-6 max-w-4xl mx-auto mb-16">
                    <motion.h1 
                        className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Discover Your
                        <span className="block bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                            Next Career Move
                        </span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="space-y-4"
                    >
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                            Where <span className="font-medium text-teal-600">Talent</span> Meets <span className="font-medium text-sky-600">Opportunity</span> – Your Success Story Begins Here
                        </p>
                    </motion.div>
                </div>

                <div className="max-w-5xl mx-auto">
                    <motion.div 
                        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-sky-100/50 p-8"
                        whileHover={{ boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.15)" }}
                    >
                        {/* Search Categories */}
                        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                            {searchCategories.map((category) => (
                                <motion.button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                                        activeCategory === category.id
                                            ? 'bg-sky-500 text-white'
                                            : 'bg-sky-50 text-sky-600 hover:bg-sky-100'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {category.icon}
                                    {category.label}
                                </motion.button>
                            ))}
                        </div>

                        {/* Main Search Bar */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Enter job title, skills, or company..."
                                    className="w-full pl-12 pr-4 py-4 text-base bg-gradient-to-r from-sky-50 to-emerald-50 border-2 border-sky-100 rounded-xl focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all placeholder:text-sky-400"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 w-5 h-5" />
                            </div>

                            {/* Location Filter */}
                            <div className="relative w-full md:w-64">
                                <select
                                    value={location}
                                onChange={(e) => {
                                        setLocation(e.target.value);
                                        handleSearch(searchTerm, e.target.value, jobType, salaryRange, experienceLevel, sortBy);
                                    }}
                                    className="w-full pl-10 pr-4 py-4 text-base bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-teal-100 rounded-xl appearance-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all"
                                >
                                    <option value="">All Locations</option>
                                    {popularLocations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400 w-5 h-5" />
                            </div>

                            <motion.button
                                onClick={() => handleSearch()}
                                className="px-8 py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white text-base font-medium rounded-xl shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Search
                            </motion.button>
                        </div>

                        {/* Quick Filters */}
                        <div className="mt-6 flex items-center gap-3 flex-wrap">
                            <span className="text-sm font-medium text-gray-500">Quick Filters:</span>
                            {popularTypes.map((filter, index) => (
                                <motion.button
                                    key={filter}
                                    onClick={() => {
                                        setJobType(filter.toLowerCase());
                                        handleSearch(searchTerm, location, filter.toLowerCase(), salaryRange, experienceLevel, sortBy);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        jobType === filter.toLowerCase()
                                            ? 'bg-sky-100 text-sky-600 shadow-inner'
                                            : 'bg-white text-gray-600 hover:bg-sky-50 hover:text-sky-600'
                                    }`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {filter}
                                </motion.button>
                            ))}
                        </div>

                        {/* Advanced Filters Button */}
                        <div className="mt-6 flex justify-between items-center">
                            <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="text-sky-600 hover:text-sky-700 flex items-center gap-2 text-sm font-medium"
                            >
                                <TrendingUp className="w-4 h-4" />
                                {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                            </button>
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium"
                                >
                                    <X className="w-4 h-4" />
                                    Clear All Filters
                                </button>
                            )}
                        </div>

                        {/* Move AnimatePresence inside the return statement */}
                        <AnimatePresence>
                            {showAdvancedFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    {/* Salary Range */}
                                    <select
                                        value={salaryRange}
                                        onChange={(e) => {
                                            setSalaryRange(e.target.value);
                                            handleSearch(searchTerm, location, jobType, e.target.value, experienceLevel, sortBy);
                                        }}
                                        className="w-full p-4 rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 border-2 border-sky-100 focus:border-sky-400 text-gray-700"
                                    >
                                        {salaryRanges.map((range) => (
                                            <option key={range.value} value={range.value}>
                                                {range.label}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Experience Level */}
                                    <select
                                        value={experienceLevel}
                                        onChange={(e) => {
                                            setExperienceLevel(e.target.value);
                                            handleSearch(searchTerm, location, jobType, salaryRange, e.target.value, sortBy);
                                        }}
                                        className="w-full p-4 rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 border-2 border-sky-100 focus:border-sky-400 text-gray-700"
                                    >
                                        {experienceLevels.map((level) => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Sort By */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                            handleSearch(searchTerm, location, jobType, salaryRange, experienceLevel, e.target.value);
                                        }}
                                        className="w-full p-4 rounded-xl bg-gradient-to-r from-sky-50 to-teal-50 border-2 border-sky-100 focus:border-sky-400 text-gray-700"
                                    >
                                        <option value="relevance">Most Relevant</option>
                                        <option value="recent">Most Recent</option>
                                        <option value="salary-high">Highest Salary</option>
                                        <option value="salary-low">Lowest Salary</option>
                                    </select>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
