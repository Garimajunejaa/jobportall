// Add or update the search endpoint handler
const searchJobs = async (req, res) => {
    try {
        const {
            query,
            location,
            jobType,
            salaryRange,
            experienceLevel,
            sortBy,
            category
        } = req.body;

        // Build search criteria
        const searchCriteria = {};
        
        if (query) {
            searchCriteria.$or = [
                { title: { $regex: query, $options: 'i' } },
                { company: { $regex: query, $options: 'i' } },
                { skills: { $regex: query, $options: 'i' } }
            ];
        }
        
        if (location) searchCriteria.location = { $regex: location, $options: 'i' };
        if (jobType) searchCriteria.jobType = jobType;
        if (experienceLevel) searchCriteria.experienceLevel = experienceLevel;
        if (salaryRange) searchCriteria.salaryRange = salaryRange;

        // Execute search query
        let jobsQuery = Job.find(searchCriteria);

        // Apply sorting
        if (sortBy === 'latest') {
            jobsQuery = jobsQuery.sort({ createdAt: -1 });
        }

        const jobs = await jobsQuery.exec();

        res.status(200).json({
            success: true,
            jobs,
            count: jobs.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching jobs',
            error: error.message
        });
    }
};

module.exports = {
    // ... other exports ...
    searchJobs
};