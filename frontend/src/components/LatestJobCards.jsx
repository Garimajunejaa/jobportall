import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, MapPin, Clock, DollarSign } from 'lucide-react'
import { Button } from './ui/button'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    
    if (!job) return null;
    
    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className='p-5 rounded-xl shadow-lg bg-white border border-gray-100 cursor-pointer hover:border-teal-200 transition-all duration-300'
            onClick={() => navigate(`/description/${job._id}`)}
        >
            <div className='flex justify-between items-start'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center'>
                        <img 
                            src={job?.company?.logo || '/company-placeholder.png'} 
                            alt={job?.company?.name || 'Company'}
                            className='w-8 h-8 object-contain'
                        />
                    </div>
                    <div>
                        <h1 className='font-medium text-lg'>{job?.company?.name || 'Company Name'}</h1>
                        <p className='text-sm text-gray-500 flex items-center gap-1'>
                            <MapPin className='w-4 h-4' /> {job?.location || 'Location'}
                        </p>
                    </div>
                </div>
                <Button variant="ghost" className="hover:text-teal-600">
                    <Bookmark className="w-5 h-5" />
                </Button>
            </div>

            <div className='mt-4'>
                <h1 className='font-bold text-lg text-gray-900'>{job?.title}</h1>
                <p className='text-sm text-gray-600 mt-2 line-clamp-2'>{job?.description}</p>
            </div>

            <div className='flex flex-wrap gap-2 mt-4'>
                <Badge className='bg-violet-100 text-violet-700 hover:bg-violet-200'>
                    {job?.position} Positions
                </Badge>
                <Badge className='bg-teal-100 text-teal-700 hover:bg-teal-200'>
                    {job?.jobType}
                </Badge>
                <Badge className='bg-cyan-100 text-cyan-700 hover:bg-cyan-200'>
                    <DollarSign className='w-4 h-4 mr-1' />
                    {job?.salary}LPA
                </Badge>
            </div>

            <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100'>
                <span className='text-sm text-gray-500 flex items-center gap-1'>
                    <Clock className='w-4 h-4' />
                    Posted {new Date(job?.createdAt).toLocaleDateString()}
                </span>
                <Button 
                    className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
                >
                    Apply Now
                </Button>
            </div>
        </motion.div>
    );
};
export default LatestJobCards