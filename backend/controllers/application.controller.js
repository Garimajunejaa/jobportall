import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import cloudinary, { generateSignedUrl } from "../utils/cloudinary.js";
import multer from "multer";
import streamifier from "streamifier";

const upload = multer();

export const applyJob = async (req, res) => {
    try {
        const userId = req.id; // Assuming user ID is set in req.id by authentication middleware
        const jobId = req.params.id;

        // Check if user and job exist
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Check if user already applied
        const existingApplication = await Application.findOne({ applicant: userId, job: jobId });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: "You have already applied for this job" });
        }

        // Create new application
        const application = new Application({
            applicant: userId,
            job: jobId,
            status: "pending",
            appliedAt: new Date()
        });

        await application.save();

        // Add application reference to user and job
        user.applications.push(application._id);
        await user.save();

        job.applications.push(application._id);
        await job.save();

        return res.status(200).json({ success: true, message: "Successfully applied for the job!" });
    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            populate: {
                path: 'applicant',
                model: 'User'
            }
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Generate signed URLs for applicant resumes
        const applicationsWithSignedUrls = await Promise.all(job.applications.map(async (application) => {
            const applicant = application.applicant.toObject();
            if (applicant.profile && applicant.profile.resume) {
                // Use the stored resume URL directly without signed URL generation
                applicant.profile.signedResumeUrl = applicant.profile.resume;
            }
            return {
                ...application.toObject(),
                applicant
            };
        }));

        return res.status(200).json({
            success: true,
            applications: applicationsWithSignedUrls
        });
    } catch (error) {
        console.error("Get applicants error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching applicants"
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id; // Assuming user ID is set in req.id by authentication middleware

        // Find applications by user and populate job and company details
        const applications = await Application.find({ applicant: userId })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    model: 'Company'
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status.toLowerCase())) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({ success: true, message: `Application status updated to ${status}` });
    } catch (error) {
        console.error('Error updating application status:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "auto", folder: "resumes" },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req);

        // Save the result.secure_url and original filename to the user profile
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        user.profile.resume = result.secure_url;
        user.profile.resumeOriginalName = req.file.originalname;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resumeUrl: result.secure_url,
            resumeOriginalName: req.file.originalname
        });
    } catch (error) {
        console.error("Error uploading resume:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload resume"
        });
    }
};
