import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import CategoryController from '@/controllers/category.controller';
import { CreateCategoryDto } from '@/dtos/category.dto';
import { PaginationDto } from '@/dtos/global.dto';

class CategoryRoute implements Routes {
  public path = '/category';
  public router = Router();
  public categoryController = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, validationMiddleware(PaginationDto, 'query'), this.categoryController.searchCategory);
    this.router.get(`${this.path}/:id`, authMiddleware, this.categoryController.getCategoryById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateCategoryDto, 'body'), this.categoryController.createCategory);
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreateCategoryDto, 'body', true),
      this.categoryController.updateCategory,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, this.categoryController.deleteCategory);
  }
}

export default CategoryRoute;
