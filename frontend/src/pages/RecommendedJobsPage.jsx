import RecommendedJobs from '../components/RecommendedJobs';

const RecommendedJobsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-violet-50 via-teal-50 to-cyan-50 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <h1
                    className="text-5xl font-extrabold mb-16 text-center bg-gradient-to-r from-violet-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent transition-transform duration-300 hover:scale-105"
                    style={{ cursor: 'default' }}
                >
                    Recommended Jobs For You
                </h1>
                <div className="bg-gradient-to-r from-violet-100 via-teal-100 to-cyan-100 rounded-3xl shadow-2xl p-14 border border-gray-300 hover:shadow-cyan-500 transition-shadow duration-500">
                    <RecommendedJobs />
                </div>
            </div>
        </div>
    );
};

export default RecommendedJobsPage;
