import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllJobs, setLoading, setError } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchFilters, searchedQuery } = useSelector(state => state.job);

    useEffect(() => {
        console.log('Current filters:', searchFilters);
        console.log('Current searchedQuery:', searchedQuery);

        const fetchJobs = async () => {
            dispatch(setLoading(true));
            try {
                console.log('Fetching jobs with filters:', searchFilters, 'and query:', searchedQuery);
                const response = await fetch(`${JOB_API_END_POINT}/filter`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        query: searchedQuery,
                        ...searchFilters
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    console.log('Jobs fetched:', data.jobs.length);
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
    }, [dispatch, searchFilters, searchedQuery]);
};

export default useGetAllJobs;
