import { NextFunction, Request, Response } from 'express';
import { Order, ProductCategory, User } from '@prisma/client';
import { CreateCategoryDto } from '@/dtos/category.dto';
import CategoryService from '@/services/category.service';
import { isEmpty } from '@/utils/util';
import { HttpException } from '@/exceptions/HttpException';
import { AddOrderDto } from '@/dtos/order.dto';
import OrderService from '@/services/order.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
enum OrderStatus {
  PENDING = 'PENDING',
  PROCESS = 'PROCESS',
  SUCCESS = 'SUCCESS',
  CANCELED = 'CANCELED',
}

class OrderController {
  public categoryService = new CategoryService();
  public orderService = new OrderService();

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

      const resAddOrder = await this.orderService.addOrder(userData, orderData);

      res.status(201).json({ data: resAddOrder, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public searchOrder = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = req['user'];
      const status = req.query['status'];
      const categoryId = req.query['categoryId'];

      const size = req.query['size'];
      const page = req.query['page'];

      console.log(status);

      if (isEmpty(size)) next(new HttpException(400, 'size is empty'));
      if (isEmpty(page)) next(new HttpException(400, 'page is empty'));

      const searchOrderResponse = await this.orderService.searchOrders(user, Number(page), Number(size), categoryId.toString(), Number(status));

      res.status(201).json({ data: searchOrderResponse, message: 'search' });
    } catch (error) {
      next(error);
    }
  };

  public findOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = req.params.id;

      const findOrderById: Order = await this.orderService.findOrderById(orderId);

      res.status(200).json({ data: findOrderById, message: 'findOne' });
    } catch (error) {}
  };
}

export default OrderController;
