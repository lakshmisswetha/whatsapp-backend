import { Request, Response, NextFunction } from "express";
import { createUser, findUser, signUser } from "../services/auth.service";

import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";

interface MyJwtPayload extends JwtPayload {
    userId: string;
}

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
        res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/auth/refreshtoken",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
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
        const { email, password } = req.body;
        const user = await signUser(email, password);
        const access_token = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET as Secret,
            { expiresIn: "1d" }
        );
        const refresh_token = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET as Secret,
            { expiresIn: "30d" }
        );
        res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/auth/refreshtoken",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "register success",
            access_token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                status: user.status,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("refreshtoken", { path: "/auth/refreshtoken" });
        res.json({
            message: "logged out",
        });
    } catch (error) {
        next(error);
    }
};
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies.refreshtoken;
        if (!refresh_token) {
            throw createHttpError.Unauthorized("Please login");
        }

        const check = jwt.verify(
            refresh_token,
            process.env.REFRESH_TOKEN_SECRET as Secret
        ) as MyJwtPayload;

        const user = await findUser(check.userId);
        const access_token = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET as Secret,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            access_token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                status: user.status,
            },
        });
    } catch (error) {
        next(error);
    }
};
