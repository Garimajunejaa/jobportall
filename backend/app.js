import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import jobRouter from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";
import jobRecommendationRouter from "./routes/jobRecommendation.route.js";

const app = express();

import dotenv from 'dotenv';
dotenv.config();

app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : [];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/jobs", jobRouter);  // Add job routes
app.use("/api/v1/application", applicationRouter);  // Add application routes
app.use("/api/v1/job", jobRecommendationRouter);  // Add job recommendation routes


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!',
    });
});
