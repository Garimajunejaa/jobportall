import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, MapPin } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { JOB_API_END_POINT } from '@/utils/constant'

const isResume = true;

const Profile = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // Removed unused appliedJobs state and fetching logic since AppliedJobTable handles it

    // If no user, redirect to login
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-violet-50">
                <Navbar />
                <div className='max-w-4xl mx-auto px-4'>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-white/80 backdrop-blur-xl border border-sky-100 rounded-3xl my-8 p-8 shadow-lg hover:shadow-xl transition-all duration-300'
                    >
                        <div className='flex justify-between items-start'>
                            <motion.div 
                                className='flex items-center gap-6'
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Avatar className="h-28 w-28 ring-2 ring-sky-500 ring-offset-4 shadow-lg">
                                    <AvatarImage src={user?.profile?.profilePhoto} />
                                </Avatar>
                                <div>
                                    <motion.h1 
                                        className='text-2xl font-bold bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent mb-2'
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {user?.fullname}
                                    </motion.h1>
                                    <motion.p 
                                        className='text-gray-600 text-lg'
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {user?.profile?.bio}
                                    </motion.p>
                                </div>
                            </motion.div>
                            
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                    onClick={() => setOpen(true)} 
                                    variant="outline"
                                    className="hover:bg-gradient-to-r from-sky-500 to-violet-500 hover:text-white transition-all duration-300 rounded-xl px-4 py-2"
                                >
                                    <Pen className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </motion.div>
                        </div>

                        <motion.div 
                            className='my-8 grid grid-cols-1 md:grid-cols-3 gap-6'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className='flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100'>
                                <Mail className="text-sky-600 h-5 w-5" />
                                <span className='text-gray-700'>{user?.email}</span>
                            </div>
                            <div className='flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100'>
                                <Contact className="text-violet-600 h-5 w-5" />
                                <span className='text-gray-700'>{user?.phoneNumber}</span>
                            </div>
                            <div className='flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100'>
                                <MapPin className="text-rose-600 h-5 w-5" />
                                <span className='text-gray-700'>{user?.profile?.location || 'Location not specified'}</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            className='my-8'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h2 className='text-xl font-semibold mb-4 text-gray-800'>Skills</h2>
                            <div className='flex flex-wrap gap-2'>
                                {user?.profile?.skills.map((skill, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Badge className="bg-gradient-to-r from-sky-100 to-violet-100 text-sky-700 px-4 py-1 text-sm font-medium rounded-full">
                                            {skill}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div 
                            className='mt-8 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Label className="text-lg font-semibold text-gray-800 mb-2 block">Resume</Label>
                            {isResume ? (
                                <a 
                                    target='blank' 
                                    href={user?.profile?.resume} 
                                    className='text-sky-600 hover:text-sky-700 font-medium hover:underline transition-colors duration-300'
                                >
                                    {user?.profile?.resumeOriginalName}
                                </a>
                            ) : (
                                <span className="text-gray-500">Not available</span>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
                <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                    <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                    {/* Applied Job Table   */}
                    <AppliedJobTable />
                </div>
                <UpdateProfileDialog open={open} setOpen={setOpen}/>
            </div>
        </>
    );
}

export default Profile
