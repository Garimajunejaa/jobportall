import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT,} from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { MapPin, Loader2, Briefcase, DollarSign, Clock, Check, Users, Calendar } from 'lucide-react';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const [isApplying, setIsApplying] = useState(false);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const applyJobHandler = async () => {
        try {
            if (!user) {
                toast.error("Please login to apply");
                navigate("/login");
                return;
            }

            setIsApplying(true);
            const response = await axios.get(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                API_CONFIG
            );

            if (response.data.success) {
                toast.success("Successfully applied for the job!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error applying for job");
        } finally {
            setIsApplying(false);
        }
    };

    // Check if user has already applied
    const hasApplied = singleJob?.applications?.some(app => 
        app.applicant === user?._id
    );

    const [isLoading, setIsLoading] = useState(true);  // Add loading state

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, API_CONFIG);
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                } else {
                    toast.error("Failed to fetch job details");
                }
            } catch (error) {
                console.error("Error fetching job:", error);
                toast.error(error.response?.data?.message || "Error fetching job details");
            } finally {
                setIsLoading(false);  // Set loading false after fetch
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            </div>
        );
    }

    if (!singleJob) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-gray-500">Job not found</p>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto my-10 px-4'>
            <div className='bg-white rounded-xl shadow-lg p-8'>
                <div className='flex flex-col items-start'>
                    <Button 
                        onClick={applyJobHandler}
                        disabled={isApplying || hasApplied}
                        className={`px-8 py-2 ${
                            hasApplied 
                                ? 'bg-emerald-500 hover:bg-emerald-600' 
                                : 'bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700'
                        } text-white transition-all duration-300 flex items-center gap-2`}
                    >
                        {isApplying ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Applying...</span>
                            </>
                        ) : hasApplied ? (
                            <>
                                <Check className="h-4 w-4" />
                                <span>Already Applied</span>
                            </>
                        ) : (
                            'Apply Now'
                        )}
                    </Button>

                    {hasApplied && (
                        <div className="mt-3 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100">
                            <div className="p-1 bg-emerald-100 rounded-full">
                                <Check className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-medium">
                                You have already applied for this job
                            </p>
                        </div>
                    )}
                </div>

                <div className='mt-8 space-y-8'>
                    {/* Job Overview Section */}
                    <div className='bg-gradient-to-br from-violet-50 to-cyan-50 rounded-xl p-6 shadow-sm border border-violet-100/20'>
                        <h3 className='text-xl font-semibold mb-4 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent'>
                            Job Overview
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md'>
                                <div className='p-2 bg-violet-100 rounded-lg'>
                                    <Briefcase className='w-5 h-5 text-violet-600' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Role</p>
                                    <p className='font-medium'>{singleJob?.title}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md'>
                                <div className='p-2 bg-cyan-100 rounded-lg'>
                                    <MapPin className='w-5 h-5 text-cyan-600' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Location</p>
                                    <p className='font-medium'>{singleJob?.location}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md'>
                                <div className='p-2 bg-emerald-100 rounded-lg'>
                                    <DollarSign className='w-5 h-5 text-emerald-600' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Salary</p>
                                    <p className='font-medium'>{singleJob?.salary} LPA</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md'>
                                <div className='p-2 bg-amber-100 rounded-lg'>
                                    <Clock className='w-5 h-5 text-amber-600' />
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Experience</p>
                                    <p className='font-medium'>{singleJob?.experienceLevel} years</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Description Section */}
                    <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                        <h3 className='text-xl font-semibold mb-4 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent'>
                            Job Description
                        </h3>
                        <p className='text-gray-600 leading-relaxed whitespace-pre-wrap'>
                            {singleJob?.description}
                        </p>
                    </div>

                    {/* Requirements Section */}
                    <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                        <h3 className='text-xl font-semibold mb-4 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent'>
                            Requirements
                        </h3>
                        <ul className='space-y-3'>
                            {singleJob?.requirements?.map((req, index) => (
                                <li key={index} className='flex items-start gap-2'>
                                    <div className='p-1 mt-1 bg-violet-100 rounded-full'>
                                        <Check className='w-3 h-3 text-violet-600' />
                                    </div>
                                    <span className='text-gray-600'>{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Application Status Section */}
                    <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                        <h3 className='text-xl font-semibold mb-4 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent'>
                            Application Status
                        </h3>
                        <div className='flex flex-col gap-4'>
                            <div className='flex items-center gap-8'>
                                <div className='flex items-center gap-2'>
                                    <Users className='w-5 h-5 text-violet-600' />
                                    <div>
                                        <p className='text-sm text-gray-500'>Total Applicants</p>
                                        <p className='font-medium'>{singleJob?.applications?.length || 0}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Calendar className='w-5 h-5 text-cyan-600' />
                                    <div>
                                        <p className='text-sm text-gray-500'>Posted Date</p>
                                        <p className='font-medium'>
                                            {new Date(singleJob?.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {hasApplied && (
                                <div className='flex items-center gap-2 bg-emerald-50 rounded-lg p-3'>
                                    <div className='p-1.5 bg-emerald-100 rounded-full'>
                                        <Check className='w-5 h-5 text-emerald-600' />
                                    </div>
                                    <div>
                                        <p className='font-medium text-emerald-700'>Application Submitted</p>
                                        <p className='text-sm text-emerald-600'>Your application is under review</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription