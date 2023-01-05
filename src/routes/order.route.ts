import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import ProductController from '@/controllers/product.controller';
import { CreateProductDto, ProductPaginationDto } from '@/dtos/product.dto';
import OrderController from '@/controllers/order.controller';
import { AddOrderDto } from '@/dtos/order.dto';

class OrderRoute implements Routes {
  public path = '/order';
  public router = Router();
  public orderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, authMiddleware, validationMiddleware(AddOrderDto, 'body'), this.orderController.addOrder);
  }
}

export default OrderRoute;
