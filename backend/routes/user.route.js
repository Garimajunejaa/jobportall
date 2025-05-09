import express from "express";
import { 
    login, 
    logout, 
    register, 
    updateProfile,
    getUserApplications
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

// Add error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.route("/register").post(singleUpload, asyncHandler(register));
router.route("/login").post(asyncHandler(login));
router.route("/logout").get(asyncHandler(logout));
router.route("/profile/update").post(isAuthenticated, singleUpload, asyncHandler(updateProfile));
router.route("/applications").get(isAuthenticated, asyncHandler(getUserApplications));
router.put("/update-profile", isAuthenticated, updateProfile);

export default router;