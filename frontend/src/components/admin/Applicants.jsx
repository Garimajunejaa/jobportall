import { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';



const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const applicants = useSelector(store => store.application.applications);

    useEffect(() => {
            const fetchAllApplicants = async () => {
                try {
                    const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                    dispatch(setAllApplicants(res.data.applications));
                    console.log("Applicants state after dispatch:", res.data.applications);
                } catch (error) {
                    console.log(error);
                }
            }
        fetchAllApplicants();
    }, []);

    return (
        <div className='min-h-screen bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
                    <div className='flex items-center justify-between mb-6'>
                        <div>
                            <h1 className='text-2xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent'>
                                Job Applicants
                            </h1>
                            <p className='text-gray-500 mt-1'>
                             View Applicants ({applicants?.length || 0})
                            </p>
                        </div>
                        <div className='text-sm text-gray-500'>
                            Job ID: {params.id}
                        </div>
                    </div>

                    {applicants?.length === 0 ? (
                        <div className='text-center py-12'>
                            <div className='text-6xl mb-4'>👥</div>
                            <h3 className='text-lg font-medium text-gray-900'>No applicants yet</h3>
                            <p className='text-gray-500'>Wait for candidates to apply for this position</p>
                        </div>
                    ) : (
                        <ApplicantsTable />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Applicants