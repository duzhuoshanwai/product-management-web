import { Schema, model } from "mongoose";
import Joi from "joi";

export interface ProductInterface {
    name: string;
    description: string;
    price: number;
    tags: string[]; //支持多个分类
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<ProductInterface & Document>({
    name: { type: String, required: true },
    description: {type: String, required: true },
    price: {type: Number, required: true },
    tags: {type: [String], required: false},
    deleted: {type: Boolean, required: false, default: false },
    createdAt: {type: Date},
    updatedAt: {type: Date}
},
    { timestamps: true }// 自动添加createdAt和updatedAt字段
);

// Joi 验证器 在controller中使用
export const productValidationSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(500).required(),
    price: Joi.number().min(0).required(),
    tags: Joi.array().items(Joi.string().min(1).max(50)).optional(), 
    deleted: Joi.boolean().optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
});

export const ProductsModel = model<ProductInterface & Document>('Products', productSchema); // 创建模型