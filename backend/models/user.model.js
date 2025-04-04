import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // URL to resume file
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'}, 
        profilePhoto:{
            type:String,
            default:""
        }
    },
    applications: [{
        job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }]
},{timestamps:true});

// Add password comparison method
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Add JWT token generation method
userSchema.methods.getJWTToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.SECRET_KEY,  // Changed from JWT_SECRET to SECRET_KEY to match your .env
        { expiresIn: '7d' }
    );
};

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export const User = mongoose.model('User', userSchema);