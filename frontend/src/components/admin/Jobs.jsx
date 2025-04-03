// ... imports remain the same ...

const Jobs = () => {
    const dispatch = useDispatch();
    const { allJobs } = useSelector(store => store.job);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchJobs = async (showToast = false) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/job/all`, {
                withCredentials: true
            });
            
            if (response.data.success) {
                dispatch(setAllJobs(response.data.jobs));
                if (showToast) {
                    toast.success("Jobs refreshed successfully");
                }
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to fetch jobs");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchJobs(false);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchJobs(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Available Jobs</h1>
                    <button 
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                    </div>
                ) : allJobs && allJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg text-slate-600">No jobs available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;