import { useEffect, useState } from 'react';
import Job from './Job';

const RecommendedJobs = () => {
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/v1/job/recommendations', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.success) {
                    setRecommendedJobs(data.recommendedJobs);
                } else {
                    setError(data.message || 'Failed to fetch recommended jobs');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch recommended jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedJobs();
    }, []);

    if (loading) return <div className="text-center py-12">Loading recommended jobs...</div>;
    if (error) return <div className="text-center py-12 text-red-500 font-semibold">Error: {error}</div>;

    if (recommendedJobs.length === 0) {
        return <div className="text-center py-12 text-gray-600 font-medium">No recommended jobs found based on your profile.</div>;
    }

    return (
        <div className="recommended-jobs">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedJobs.map((job) => (
                    <div
                        key={job._id}
                        className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                        style={{ cursor: 'pointer' }}
                    >
                        <Job job={job} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedJobs;
