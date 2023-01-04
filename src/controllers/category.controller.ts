import { NextFunction, Request, Response } from 'express';
import { ProductCategory } from '@prisma/client';
import { CreateCategoryDto } from '@/dtos/category.dto';
import CategoryService from '@/services/category.service';
import { isEmpty } from '@/utils/util';
import { HttpException } from '@/exceptions/HttpException';

class CategoryController {
  public categoryService = new CategoryService();

  public searchCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const size = req.query['size'];
    const page = req.query['page'];
    const key = req.query['key'];

    if (isEmpty(size)) next(new HttpException(400, 'size is empty'));
    if (isEmpty(page)) next(new HttpException(400, 'page is empty'));

    try {
      const searchCategory = await this.categoryService.searchCategory(Number(page), Number(size), key === undefined ? '' : key.toString());
      res.status(200).json({ data: searchCategory, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = req.params.id;

      const findOneCategory: ProductCategory = await this.categoryService.findCategoryById(categoryId);

      res.status(200).json({ data: findOneCategory, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryData: CreateCategoryDto = req.body;
      // const createUserData: User = await this.userService.createUser(userData);

      const createCategory: ProductCategory = await this.categoryService.createCategory(categoryData);

      res.status(201).json({ data: createCategory, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = req.params.id;
      const categoryData: CreateCategoryDto = req.body;
      const updatedCategory: ProductCategory = await this.categoryService.updateCategory(categoryId, categoryData);

      res.status(200).json({ data: updatedCategory, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = req.params.id;
      const deleteUserData: ProductCategory = await this.categoryService.deleteCategory(categoryId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CategoryController;
