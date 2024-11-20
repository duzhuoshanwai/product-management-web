import { ProductsModel, ProductInterface } from "../models/Product";

export class ProductService {
    // 创建产品
    public createProduct = async (product: any): Promise<ProductInterface | null> => {
        return await ProductsModel.create(product);
    };

    // 获取所有产品
    public getAllProducts = async (): Promise<Document[]> => {
        return await ProductsModel.find();
    };

    // 获取所有产品（分页）
    public getProductsByPage = async (page: number, limit: number): Promise<Document[]> => {
        return await ProductsModel.find({ deleted: { $ne: true } })
            .skip((page - 1) * limit)
            .limit(limit);
    };

    // 获取所有产品数量 estimatedDocumentCount() 
    // https://www.mongodb.com/zh-cn/docs/manual/reference/method/db.collection.estimatedDocumentCount/
    public getProductsCount = async (): Promise<number> => {
        // return await ProductsModel.estimatedDocumentCount();
        return await ProductsModel.countDocuments({ deleted: { $ne: true } });
    }

    // 获取单个产品
    public getProductById = async (id: string): Promise<ProductInterface | null> => {
        return await ProductsModel.findById(id);
    };

    // 更新产品
    public updateProductById = async (id: string, product: ProductInterface): Promise<ProductInterface | null> => {
        return await ProductsModel.findByIdAndUpdate(id, product, { new: true });
    };

    // 删除产品（软删除）
    public deleteProductById = async (id: string): Promise<ProductInterface | null> => {
        return await ProductsModel.findByIdAndUpdate(id, { deleted: true }, { new: true });
    };
}

