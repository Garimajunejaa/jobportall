import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import jobRouter from "./routes/job.route.js";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/jobs", jobRouter);  // Add job routes


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!',
    });
});