import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllJobs, setLoading, setError } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { filters, searchedQuery } = useSelector(state => state.job);

    useEffect(() => {
        const fetchJobs = async () => {
            dispatch(setLoading(true));
            try {
                const response = await fetch(`${JOB_API_END_POINT}/filter`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        query: searchedQuery,
                        ...filters
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    dispatch(setAllJobs(data.jobs));
                }
            } catch (error) {
                dispatch(setError(error.message));
                console.error('Error fetching jobs:', error);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchJobs();
    }, [dispatch, filters, searchedQuery]);
};

export default useGetAllJobs;