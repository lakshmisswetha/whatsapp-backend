import createHttpError from "http-errors";
import UserModel, { IUser } from "../models/userModel";
import validator from "validator";
import bcrypt from "bcrypt";

const { DEFAULT_PIC, DEFAULT_STATUS } = process.env;

export const createUser = async (userData: IUser) => {
    const { name, email, picture, status, password } = userData;

    if (!name || !email || !password) {
        throw createHttpError.BadRequest("please fill all fields");
    }

    if (
        !validator.isLength(name, {
            min: 2,
            max: 16,
        })
    ) {
        throw createHttpError.BadRequest("please make sure name is between 2 to 16 characters");
    }

    if (status && status.length >= 32) {
        throw createHttpError.BadRequest("please make sure status is atmost 32 characters long");
    }

    if (!validator.isEmail(email)) {
        throw createHttpError.BadRequest("please enter a valid email");
    }

    const checkDB = await UserModel.findOne({ email });
    if (checkDB) {
        throw createHttpError.Conflict("email already exist");
    }

    if (
        !validator.isLength(password, {
            min: 6,
            max: 50,
        })
    ) {
        throw createHttpError.BadRequest(
            "please make sure password is between 6 to 50 characters long"
        );
    }

    const user = await new UserModel({
        name,
        email,
        picture: picture || DEFAULT_PIC,
        status: status || DEFAULT_STATUS,
        password,
    }).save();

    return user;
};

export const signUser = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (!user) throw createHttpError.NotFound("invalid credentials");

    let passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw createHttpError.NotFound("invalid credentials");

    return user;
};

export const findUser = async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) throw createHttpError.BadRequest("please fill all fields");
    return user;
};
