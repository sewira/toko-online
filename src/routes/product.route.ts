import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import ProductController from '@/controllers/product.controller';
import { CreateProductDto, ProductPaginationDto } from '@/dtos/product.dto';

class ProductRoute implements Routes {
  public path = '/product';
  public router = Router();
  public productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, validationMiddleware(ProductPaginationDto, 'query'), this.productController.searchProduct);
    this.router.get(`${this.path}/:id`, authMiddleware, this.productController.getProductById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateProductDto, 'body'), this.productController.createProduct);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(CreateProductDto, 'body'), this.productController.updateProduct);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.productController.deleteProduct);
  }
}

export default ProductRoute;
