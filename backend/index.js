import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from './routes/user.route.js';
import companyRoute from "./routes/company.route.js";
import jobRoute from './routes/job.route.js'; // Fixed import name
import applicationRoute from "./routes/application.route.js";
import jobRecommendationRoute from "./routes/jobRecommendation.route.js";
import path from "path";

dotenv.config({});

const app = express();
const __dirname = path.resolve();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:['https://jobportall-1-gylx.onrender.com','http://localhost:3000','http://localhost:8000','http://localhost:5173'],
    credentials:true
}

app.use(cors(corsOptions));

// api's
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute); // Keep only one job route
app.use("/api/v1/job", jobRecommendationRoute); // Add job recommendation route
app.use("/api/v1/application", applicationRoute);
app.use(express.static(path.join(__dirname,"./frontend/dist")));
app.get("*",(_,res)=>{
    res.sendFile(path.join(__dirname,"./frontend/dist/index.html"));
});

const PORT = process.env.PORT || 8000; // Changed port to 8000

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
