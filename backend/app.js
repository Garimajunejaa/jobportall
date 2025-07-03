import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import jobRouter from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";
import jobRecommendationRouter from "./routes/jobRecommendation.route.js";

const app = express();

app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = ['https://jobportall-1-gylx.onrender.com', 'http://localhost:3000'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, origin);
        } else {
            callback(null, false);
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
