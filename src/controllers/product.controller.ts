import { CreateProductDto } from '@/dtos/product.dto';
import { HttpException } from '@/exceptions/HttpException';
import CategoryService from '@/services/category.service';
import ProductService from '@/services/product.service';
import { Product } from '@prisma/client';
import e, { NextFunction, Request, Response } from 'express';

class ProductController {
  public categoryService = new CategoryService();
  public productService = new ProductService();

  public searchProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const size = req.query['size'];
    const page = req.query['page'];
    const categoryId = req.query['categoryId'];
    const key = req.query['key'];

    try {
      const searchCategory = await this.productService.searchProduct(
        Number(page),
        Number(size),
        key === undefined ? '' : key.toString(),
        categoryId === undefined ? '' : categoryId.toString(),
      );
      res.status(200).json({ data: searchCategory, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dummies = [1, 2, 3];

      const productId = req.params.id;

      const findProduct: Product = await this.productService.findProductById(productId);

      res.status(200).json({ data: findProduct, message: 'findOne' });
      // throw new HttpException(500, 'error.message');
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productData: CreateProductDto = req.body;

      const createProduct: Product = await this.productService.createProduct(productData);

      res.status(201).json({ data: createProduct, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const productData: CreateProductDto = req.body;
      const updatedProduct: Product = await this.productService.updateProduct(productId, productData);

      res.status(200).json({ data: updatedProduct, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const deleteProduct: Product = await this.productService.deleteProduct(productId);

      res.status(200).json({ data: deleteProduct, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
