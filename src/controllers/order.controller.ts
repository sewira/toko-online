import { NextFunction, Request, Response } from 'express';
import { ProductCategory, User } from '@prisma/client';
import { CreateCategoryDto } from '@/dtos/category.dto';
import CategoryService from '@/services/category.service';
import { isEmpty } from '@/utils/util';
import { HttpException } from '@/exceptions/HttpException';
import { AddOrderDto } from '@/dtos/order.dto';
import OrderService from '@/services/order.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

class OrderController {
  public categoryService = new CategoryService();
  public OrderService = new OrderService();

  public getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = req.params.id;

      const findOneCategory: ProductCategory = await this.categoryService.findCategoryById(categoryId);

      res.status(200).json({ data: findOneCategory, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public addOrder = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderData: AddOrderDto = req.body;
      const userData: User = req.user;

      const resAddOrder = await this.OrderService.addOrder(userData, orderData);

      res.status(201).json({ data: resAddOrder, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export default OrderController;
