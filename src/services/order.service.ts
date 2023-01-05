import { AddOrderDto } from '@/dtos/order.dto';
import { HttpException } from '@/exceptions/HttpException';

import { PrismaClient, Order, User, Product } from '@prisma/client';

class OrderService {
  public order = new PrismaClient().order;
  public user = new PrismaClient().user;
  public product = new PrismaClient().product;
  public itemOrder = new PrismaClient().itemOrder;
  //buy servie

  public async addOrder(user: User, orderData: AddOrderDto) {
    const listProduct: Product[] = [];

    for (let index = 0; index < orderData.products.length; index++) {
      const element = orderData.products[index];

      const findProduct: Product = await this.product.findFirst({
        where: {
          id: element.productId,
          AND: {
            quanty: {
              gte: element.totalProduct,
            },
          },
        },
      });

      if (findProduct !== null) {
        listProduct.push(findProduct);
      } else {
        throw new HttpException(400, `Product ${element.productId} tidak tersedia atau jumlah yang dipesan melebihi stock`);
      }
    }

    const mappingItemOrder = orderData.products.map(item => {
      return {
        totalItem: item.totalProduct,
        totalPriceItem: item.totalProductPrice,
        product: {
          connect: {
            id: item.productId,
          },
        },
      };
    });

    const createOrder: Order = await this.order.create({
      data: {
        totalPrice: orderData.totalPrice,
        itemOrder: {
          create: mappingItemOrder,
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    for (let index = 0; index < orderData.products.length; index++) {
      const element = orderData.products[index];

      await this.product.update({
        where: {
          id: element.productId,
        },
        data: {
          quanty: {
            decrement: element.totalProduct,
          },
        },
      });
    }

    return createOrder;
  }
}

export default OrderService;
