import express from 'express';
import { ProductController } from '../controllers/productController';

const productRouter = express.Router();
// 创建 ProductController 的实例
const productController = new ProductController();

// 定义路由

// 显示添加产品页面
productRouter.get('/products/add', productController.showAddProductPage);
productRouter.post('/products/create', productController.handleAddProductForm);

// 显示修改产品页面
productRouter.get('/products/edit/:id', productController.showEditProductPage);
productRouter.post('/products/update/:id', productController.handleEditProductForm);

// 获取所有产品
productRouter.get('/products', productController.showProductsByPage);

// 获取产品详情
productRouter.get('/products/:id', productController.showProductInfoPage);

// 删除产品
productRouter.post('/products/remove/:id', productController.deleteProductById);

// 导出路由实例
export default productRouter;