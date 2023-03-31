import {model, Schema} from 'mongoose';

export interface IUser {
    fullName: string;
    password: string;
    email: string;
}

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
})

export const User = model<IUser>("user", userSchema);
