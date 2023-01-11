import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import ProductController from '@/controllers/product.controller';
import { CreateProductDto, ProductPaginationDto } from '@/dtos/product.dto';
import OrderController from '@/controllers/order.controller';
import { AddOrderDto } from '@/dtos/order.dto';
import { PaginationDto } from '@/dtos/global.dto';

class OrderRoute implements Routes {
  public path = '/order';
  public router = Router();
  public orderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(AddOrderDto, 'body'), this.orderController.addOrder);
    this.router.get(`${this.path}/detail/:id`, authMiddleware, this.orderController.findOrderById);
    this.router.get(`${this.path}`, authMiddleware, this.orderController.searchOrder);
  }
}

export default OrderRoute;
