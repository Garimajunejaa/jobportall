import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector, useDispatch } from 'react-redux'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { APPLICATION_API_END_POINT,} from '@/utils/constant'
import { toast } from 'sonner'
import { setAllAppliedJobs } from '@/redux/jobSlice'

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`${APPLICATION_API_END_POINT}`);
                if (response.data.success) {
                    dispatch(setAllAppliedJobs(response.data.applications));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch applications');
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, [dispatch]);

    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'rejected':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'accepted':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(() => {
        setIsLoading(false);
    }, [allAppliedJobs]);

    if (isLoading) {
        return <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>;
    }

    return (
        <div className='bg-white rounded-xl shadow-lg p-6'>
            <Table>
                <TableCaption className="text-gray-500 mb-4">
                    {!allAppliedJobs || allAppliedJobs.length === 0 
                        ? "You haven't applied to any jobs yet" 
                        : `A list of your ${allAppliedJobs.length} job applications`
                    }
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gradient-to-r from-violet-50 to-cyan-50">
                        <TableHead className="font-semibold text-violet-900">Date</TableHead>
                        <TableHead className="font-semibold text-violet-900">Job Role</TableHead>
                        <TableHead className="font-semibold text-violet-900">Company</TableHead>
                        <TableHead className="font-semibold text-violet-900 text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!allAppliedJobs || allAppliedJobs.length <= 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-4xl">📋</span>
                                    <p className="text-gray-500">No applications found</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        allAppliedJobs.map((appliedJob) => (
                            <TableRow 
                                key={appliedJob._id}
                                className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-cyan-50 transition-colors duration-200"
                            >
                                <TableCell className="font-medium">
                                    {formatDate(appliedJob?.createdAt)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-violet-900">
                                            {appliedJob.job?.title}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {appliedJob.job?.jobType}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {appliedJob.job?.company?.logo && (
                                            <img 
                                                src={appliedJob.job?.company?.logo} 
                                                alt={appliedJob.job?.company?.name}
                                                className="w-6 h-6 rounded-full"
                                            />
                                        )}
                                        <span>{appliedJob.job?.company?.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge className={`${getStatusColor(appliedJob?.status)} border`}>
                                        {appliedJob.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable