import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminNavbar from '../shared/AdminNavbar';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Download, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const JobApplicants = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/job/${jobId}/applicants`, {
                    withCredentials: true
                });
                
                if (response.data.success) {
                    setApplicants(response.data.applicants);
                    setJobDetails(response.data.job);
                }
            } catch (error) {
                toast.error("Failed to fetch applicants");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplicants();
    }, [jobId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-cyan-50">
            <AdminNavbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Button 
                    onClick={() => navigate('/admin/jobs')}
                    variant="ghost" 
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Jobs
                </Button>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                        {jobDetails?.title} - Applicants
                    </h1>
                    <p className="text-gray-600">
                        Total Applications: {applicants.length}
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {applicants.map((applicant) => (
                            <motion.div
                                key={applicant._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {applicant.name}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-2 text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                <a href={`mailto:${applicant.email}`} className="hover:text-violet-600">
                                                    {applicant.email}
                                                </a>
                                            </div>
                                            {applicant.phone && (
                                                <div className="flex items-center gap-1">
                                                    <Phone className="w-4 h-4" />
                                                    <a href={`tel:${applicant.phone}`} className="hover:text-violet-600">
                                                        {applicant.phone}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    {applicant.resume && (
                                        <Button 
                                            variant="outline" 
                                            className="mr-2"
                                            onClick={() => window.open(applicant.resume, '_blank')}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Resume
                                        </Button>
                                    )}
                                    {applicant.portfolio && (
                                        <Button 
                                            variant="outline"
                                            onClick={() => window.open(applicant.portfolio, '_blank')}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            View Portfolio
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplicants;