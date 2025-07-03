import { Job } from "../models/job.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            requirements, 
            salary, 
            location, 
            jobType, 
            experienceLevel, 
            position, 
            company,
            isFeatured // Added isFeatured field
        } = req.body;
        
        const userId = req.id;

        // Validate required fields
        if (!title || !description || !requirements || !salary || 
            !location || !jobType || !position || !company || 
            experienceLevel === undefined) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        // Create new job
        const job = await Job.create({
            title,
            description,
            requirements: Array.isArray(requirements) ? requirements : requirements.split(','),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experienceLevel),
            position: Number(position),
            company, // Changed from companyId to company
            isFeatured: isFeatured || false, // Set isFeatured, default false
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Job creation error:", error);
        return res.status(500).json({
            message: "Error creating job",
            success: false,
            error: error.message
        });
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        // Set proper headers
        res.setHeader('Content-Type', 'application/json');

        const jobs = await Job.find()
            .populate({
                path: 'company',
                select: 'name logo location'
            })
            .sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                success: false,
                message: "No jobs found"
            });
        }

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs: jobs
        });
    } catch (error) {
        console.error("Error in getAllJobs:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching jobs",
            error: error.message
        });
    }
};

// Single searchJobs function with all features
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// Add this new controller function
export const applyToJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.userId || req.id;

        // Validate userId
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        // Find job and validate
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user has already applied
        const alreadyApplied = job.applications?.some(
            app => app.toString() === userId?.toString()
        );

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        // Create new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            status: "pending"
        });

        // Add application reference to job
        if (!job.applications) {
            job.applications = [];
        }
        job.applications.push(newApplication._id);

        // Save the job
        await job.save();

        return res.status(200).json({
            success: true,
            message: "Successfully applied for the job"
        });

    } catch (error) {
        console.error('Job application error:', error);
        return res.status(500).json({
            success: false,
            message: "Error applying for job",
            error: error.message
        });
    }
};

// Add this to get user's applied jobs
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const jobs = await Job.find({
            'applications': { $elemMatch: { applicant: userId } }
        }).populate('company');

        return res.status(200).json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error('Get applied jobs error:', error);
        return res.status(500).json({
            success: false,
            message: "Error fetching applied jobs",
            error: error.message
        });
    }
};

export const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.id;
        const { name, email, phone, company, location } = req.body;

        const updatedAdmin = await User.findByIdAndUpdate(
            adminId,
            {
                name,
                email,
                phone,
                company,
                location
            },
            { 
                new: true,
                runValidators: true 
            }
        ).select('-password');

        if (!updatedAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedAdmin
        });

    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};
// Add this new controller function
export const getRecentApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('job')
            .populate('applicant', 'fullname');

        const formattedApplications = applications.map(app => ({
            text: `${app.applicant.fullname} applied for ${app.job.title}`,
            time: new Date(app.createdAt).toLocaleString()
        }));

        return res.status(200).json({
            success: true,
            applications: formattedApplications
        });
    } catch (error) {
        console.error("Get recent applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching recent applications"
        });
    }
};
// Add this new controller function for search and filters

        // Remove the duplicate searchJobs function and keep only one version
        export const searchJobs = async (req, res) => {
            try {
                const { query, location, jobType, salaryRange, experienceLevel, sortBy } = req.body;
                
                let filterQuery = {};
        
                // Search query filter
                if (query) {
                    filterQuery.$or = [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } },
                        { company: { $regex: query, $options: 'i' } }
                    ];
                }
        
                // Location filter
                if (location) {
                    filterQuery.location = { $regex: location, $options: 'i' };
                }
        
                // Job type filter
                if (jobType) {
                    filterQuery.jobType = jobType;
                }
        
                // Salary range filter
                if (salaryRange && salaryRange !== '') {
                    const [min, max] = salaryRange.split('-').map(Number);
                    if (max) {
                        filterQuery.salary = { $gte: min, $lte: max };
                    } else {
                        filterQuery.salary = { $gte: min };
                    }
                }
        
                // Experience level filter
                if (experienceLevel && experienceLevel !== '') {
                    filterQuery.experienceLevel = experienceLevel;
                }
        
                // Apply sorting
                let sortOptions = {};
                switch (sortBy) {
                    case 'recent':
                        sortOptions = { createdAt: -1 };
                        break;
                    case 'salary-high':
                        sortOptions = { salary: -1 };
                        break;
                    case 'salary-low':
                        sortOptions = { salary: 1 };
                        break;
                    default:
                        sortOptions = { createdAt: -1 }; // Default to most recent
                }
        
                const jobs = await Job.find(filterQuery)
                    .sort(sortOptions)
                    .populate({
                        path: 'company',
                        select: 'name logo location'
                    });
        
                return res.status(200).json({
                    success: true,
                    count: jobs.length,
                    jobs
                });
            } catch (error) {
                console.error("Search jobs error:", error);
                return res.status(500).json({
                    success: false,
                    message: "Error searching jobs",
                    error: error.message
                });
            }
        };
export const filterJobs = async (req, res) => {
    try {
        const { query, location, jobType, salaryRange, experienceLevel, sortBy } = req.body;
        
        let filterQuery = {};

        // Search query filter
        if (query) {
            filterQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        // Location filter
        if (location) {
            filterQuery.location = { $regex: location, $options: 'i' };
        }

        // Job type filter
        if (jobType) {
            filterQuery.jobType = jobType;
        }

        // Salary range filter
        if (salaryRange) {
            const [min, max] = salaryRange.split('-').map(Number);
            if (max) {
                filterQuery.salary = { $gte: min, $lte: max };
            } else {
                filterQuery.salary = { $gte: min };
            }
        }

        // Experience level filter
        if (experienceLevel) {
            filterQuery.experienceLevel = experienceLevel;
        }

        // Apply sorting
        let sortOptions = {};
        switch (sortBy) {
            case 'recent':
                sortOptions = { createdAt: -1 };
                break;
            case 'salary-high':
                sortOptions = { salary: -1 };
                break;
            case 'salary-low':
                sortOptions = { salary: 1 };
                break;
            default:
                sortOptions = { createdAt: -1 };
        }

        const jobs = await Job.find(filterQuery)
            .sort(sortOptions)
            .populate({
                path: 'company',
                select: 'name logo location'
            });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (error) {
        console.error("Filter jobs error:", error);
        return res.status(500).json({
            success: false,
            message: "Error filtering jobs",
            error: error.message
        });
    }
};