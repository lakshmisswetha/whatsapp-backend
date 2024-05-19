import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export interface IUser {
    name: string;
    email: string;
    picture: string;
    status: string;
    password: string;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "please provide your name"],
        },
        email: {
            type: String,
            required: [true, "please provide your email"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        picture: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            default: "Hey there! I am using whatsapp",
        },
        password: {
            type: String,
            required: [true, "please provide your password"],
            minLength: [6, "please make sure your password is atleast 6 characters long"],
            maxLength: [50, "please make sure your password is less than 50 characters long"],
        },
    },
    {
        collection: "users",
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    try {
        if (this.isNew) {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {}
});

const UserModel = mongoose.model<IUser>("UserModel", userSchema);
export default UserModel;
