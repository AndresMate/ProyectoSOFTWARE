import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userController";
import {verifyToken} from "../middlewares/authMiddleware";

const router = Router();

// Protected Routes (Only authenticated users can access)
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

export default router;
