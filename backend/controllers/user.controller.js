import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary, { generateSignedUrl } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        // Check only required fields
        if (!fullname || !email || !password || !role) {
            return res.status(400).json({
                message: "Please fill all required fields (name, email, password, role)",
                success: false
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address",
                success: false
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname: fullname.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role,
            phoneNumber: phoneNumber?.trim() || "",
            profile: {
                profilePhoto: ""
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Registration failed. Please try again later.",
            success: false
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, location } = req.body;
        const userId = req.id;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Handle file upload only if a file is present
        if (req.file) {
            // Validate file type and size
            const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file type. Only PDF and image files are allowed.'
                });
            }
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (req.file.size > maxSize) {
                return res.status(400).json({
                    success: false,
                    message: 'File size exceeds 5MB limit.'
                });
            }
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            // Update resume or profile photo based on mimetype
            if (req.file.mimetype === 'application/pdf') {
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = req.file.originalname;
            } else {
                user.profile.profilePhoto = cloudResponse.secure_url;
            }
        }

        // Generate signed URL for resume if exists
            if (user.profile.resume) {
                // Extract public ID from URL
                const url = user.profile.resume;
                // Remove base URL and version number to get publicId
                const baseUrlPattern = /https:\/\/res\.cloudinary\.com\/[^\/]+\/raw\/upload\/v\d+\//;
                const publicIdWithExt = url.replace(baseUrlPattern, '');
                // Remove file extension
                const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
                if (publicId) {
                    user.profile.signedResumeUrl = generateSignedUrl(publicId, { expires_at: Math.floor(Date.now() / 1000) + 3600 });
                } else {
                    user.profile.signedResumeUrl = user.profile.resume;
                }
            }

        // Update other fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) {
            const skillsArray = skills.split(",");
            user.profile.skills = skillsArray;
        }
        if (location) user.profile.location = location;

        await user.save();

        // Format user response
        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({
            message: "Failed to update profile",
            success: false,
            error: error.message
        });
    }
};
export const getUserApplications = async (req, res) => {
    try {
        const userId = req.userId || req.id;
        
        const user = await User.findById(userId)
            .populate({
                path: 'applications.job',
                populate: {
                    path: 'company',
                    model: 'Company'
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            applications: user.applications
        });

    } catch (error) {
        console.error("Get applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching applications"
        });
    }
}; // Keep only one instance of getUserApplications