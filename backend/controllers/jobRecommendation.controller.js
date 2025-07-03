import Job from '../models/job.model.js';
import { User } from '../models/user.model.js';

// Enhanced job recommendation based on matching user skills and bio keywords with job skills and descriptions
export const getJobRecommendations = async (req, res) => {
    try {
        const userId = req.id; // Assuming user ID is set in req.id by authentication middleware
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userSkills = (user.profile.skills || []).map(s => s.toLowerCase());
        const userBio = (user.profile.bio || '').toLowerCase();

        // Fetch all jobs with company populated
        const allJobs = await Job.find({}).populate('company');

        // Filter jobs where at least one required skill matches user skills
        // or job title/description contains keywords from user bio
        const recommendedJobs = allJobs.filter(job => {
            const jobSkills = (job.skillsRequired || []).map(s => s.toLowerCase());
            const jobTitle = (job.title || '').toLowerCase();
            const jobDescription = (job.description || '').toLowerCase();

            const skillMatch = jobSkills.some(skill => userSkills.includes(skill));
            const bioMatch = userBio
                .split(/\W+/)
                .some(keyword => keyword.length > 2 && (jobTitle.includes(keyword) || jobDescription.includes(keyword)));

            return skillMatch || bioMatch;
        });

        res.status(200).json({
            success: true,
            recommendedJobs
        });
    } catch (error) {
        console.error('Error fetching job recommendations:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
