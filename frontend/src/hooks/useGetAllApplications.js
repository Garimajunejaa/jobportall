import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { setApplications, setLoading, setError } from '@/redux/applicationSlice'

const useGetAllApplications = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                dispatch(setLoading(true));
                const res = await axios.get(`${APPLICATION_API_END_POINT}/admin/all`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setApplications(res.data.applications));
                }
            } catch (error) {
                dispatch(setError(error.response?.data?.message || 'Failed to fetch applications'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchApplications();
    }, [dispatch]);
};

export default useGetAllApplications; 