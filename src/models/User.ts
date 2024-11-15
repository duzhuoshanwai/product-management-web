import mongoose, { Schema, model } from 'mongoose';
import Joi from "joi";

export interface UserInterface {
    id: any;
    username: string;
    password_hash: string;
}

export const UserSchema: Schema = new Schema<UserInterface & Document>({
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
}, { timestamps: true }
);

// 导出模型
export const UserModel = model<UserInterface & Document>('User', UserSchema); 