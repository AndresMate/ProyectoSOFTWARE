import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
    user?: { id: string };
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.user = { id: decoded.id };

        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }

        next(); // ✅ Solo se llama a next()
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
