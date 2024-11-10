import { Schema, model } from "mongoose";
import Joi from "joi";

export interface ProductInterface {
    name: string;
    description: string;
    price: number;
    tag: string[]; //支持多个分类
    deleted: boolean;
}

const productSchema = new Schema<ProductInterface & Document>({
    name: { type: String, required: true },
    description: {type: String, required: true },
    price: {type: Number, required: true },
    tag: {type: [String], required: false},
    deleted: {type: Boolean, required: false, default: false }
},
    { timestamps: true }// 自动添加createdAt和updatedAt字段
);

// Joi 验证器 在controller中使用
export const productValidationSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(500).required(),
    price: Joi.number().min(0).required(),
    tag: Joi.array().items(Joi.string().min(1).max(50)).optional(), 
    deleted: Joi.boolean().optional() 
});

export const ProductsModel = model<ProductInterface & Document>('Products', productSchema); // 创建模型