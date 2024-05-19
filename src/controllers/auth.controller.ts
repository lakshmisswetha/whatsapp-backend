import { Request, Response, NextFunction } from "express";
import { createUser } from "../services/auth.service";

import jwt, { Secret } from "jsonwebtoken";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, picture, status, password } = req.body;
        const newUser = await createUser({ name, email, picture, status, password });
        const access_token = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET as Secret,
            { expiresIn: "1d" }
        );
        const refresh_token = jwt.sign(
            { userId: newUser._id },
            process.env.REFRESH_TOKEN_SECRET as Secret,
            { expiresIn: "30d" }
        );
        res.json({
            message: "register success",
            access_token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                picture: newUser.picture,
                status: newUser.status,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
        next(error);
    }
};
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
        next(error);
    }
};
