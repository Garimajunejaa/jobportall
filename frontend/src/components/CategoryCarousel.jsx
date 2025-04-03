import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery, setSearchFilters } from '@/redux/jobSlice';
import { motion } from 'framer-motion';

const categories = [
    { name: "Frontend Developer", icon: "💻", color: "from-violet-500 to-purple-500", jobType: "technical" },
    { name: "Backend Developer", icon: "⚙️", color: "from-teal-500 to-green-500", jobType: "technical" },
    { name: "Data Science", icon: "📊", color: "from-blue-500 to-cyan-500", jobType: "technical" },
    { name: "Graphic Designer", icon: "🎨", color: "from-pink-500 to-rose-500", jobType: "design" },
    { name: "FullStack Developer", icon: "🚀", color: "from-orange-500 to-amber-500", jobType: "technical" },
    { name: "UI/UX Designer", icon: "✨", color: "from-indigo-500 to-violet-500", jobType: "design" },
    { name: "DevOps Engineer", icon: "🛠", color: "from-cyan-500 to-teal-500", jobType: "technical" },
    { name: "Product Manager", icon: "📱", color: "from-rose-500 to-pink-500", jobType: "management" }
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        // Update search filters
        const searchFilters = {
            query: category.name,
            jobType: category.jobType,
            location: '',
            experienceLevel: '',
            salaryRange: '',
            sortBy: 'relevance'
        };

        // Update Redux state
        dispatch(setSearchFilters(searchFilters));
        dispatch(setSearchedQuery(category.name));

        // Navigate to jobs page with search parameters
        navigate('/jobs', { 
            state: { searchFilters }
        });
    };

    return (
        <div className='bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50 py-16'>
            <div className='max-w-7xl mx-auto px-4'>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-3xl font-bold text-center mb-10'
                >
                    Explore Popular <span className='bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent'>Categories</span>
                </motion.h2>
                
                <Carousel className="w-full max-w-5xl mx-auto">
                    <CarouselContent>
                        {categories.map((cat, index) => (
                            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Button
                                        onClick={() => handleCategoryClick(cat)}
                                        variant="outline"
                                        className={`w-full h-32 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gradient-to-r ${cat.color} hover:text-white transition-all duration-300 group`}
                                    >
                                        <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </Button>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-white hover:bg-gradient-to-r from-violet-600 to-cyan-600 hover:text-white" />
                    <CarouselNext className="bg-white hover:bg-gradient-to-r from-violet-600 to-cyan-600 hover:text-white" />
                </Carousel>
            </div>
        </div>
    );
};

export default CategoryCarousel;