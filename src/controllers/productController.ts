import { ProductService } from "../services/productServices";
import { Request, Response } from "express";
import { productValidationSchema } from "../models/Product"; // 导入 Joi 验证器

const productService = new ProductService();

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    // 显示添加产品页面
    public showAddProductPage = async (req: Request, res: Response) => {
        res.render('productAddForm', { response: null }); // 传递 response 参数
    };

    // 处理添加产品表单提交
    public handleAddProductForm = async (req: Request, res: Response) => {
        try {
            const { error } = productValidationSchema.validate(req.body);
            if (error) {
                res.json({ status: 400, message: '验证失败', error: error.details } );
                return;
            }
            const product = await productService.createProduct(req.body);
            res.status(201).json({message: '产品创建成功', productId: (product as any)._id } );
        } catch (error) {
            res.status(500).json({ response: { status: 500, message: '修改产品失败', error } });
        }
    };

    // 显示修改产品页面
    public showEditProductPage = async (req: Request, res: Response) => {
        try {
            const product = await productService.getProductById(req.params.id);
            res.render('productEditForm', { product, productId: req.params.id, response: {} });
        } catch (error) {
            res.status(500).json({ message: '修改的产品id可能不存在', error });
        }
    };

    // 处理修改产品表单提交
    public handleEditProductForm = async (req: Request, res: Response) => {
        try {
            const { error } = productValidationSchema.validate(req.body);
            if (error) {
                res.render('productEditForm', { response: { status: 400, message: '验证失败', error: error.details } });
                return;
            }
            const product = await productService.updateProductById(req.params.id, req.body);
            res.status(200).json({ message: '修改产品成功',  productId: (product as any)._id});
        } catch (error) {
            res.status(500).json({ response: { status: 500, message: '修改产品失败', error } });
        }
    };

    // 获取所有产品
    public getAllProducts = async (req: Request, res: Response) => {
        try {
            const products = await productService.getAllProducts();
            res.render('productsList', { products });
        } catch (error) {
            res.status(500).json({ message: '获取所有产品列表失败', error });
        }
    };

    // 获取所有产品（分页）
    public getProductsByPage = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const totalPage = Math.ceil(await productService.getProductsCount() / limit);
            const products = await productService.getProductsByPage(page, limit);
            res.render('productsList', { products, currentPage: page, limit, totalPage });
        } catch (error) {
            res.status(500).json({ message: '获取产品列表（分页）失败', error });
        }
    };

    // 根据Id获取产品
    public getProductsById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const product = await productService.getProductById(id);
            res.render('productInfo', { product });
        } catch (error) {
            res.status(500).json({ message: '根据id获取产品失败', error });
        }
    };

    // 根据Id更新产品
    public updateProductById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const product = await productService.updateProductById(id, req.body);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: '根据id获取产品失败', error });
        }
    };

    // 根据Id删除产品（软删除）
    public deleteProductById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const product = await productService.deleteProductById(id);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: '根据id删除产品失败', error });
        }
    };
}