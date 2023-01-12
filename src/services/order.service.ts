import { AddOrderDto } from '@/dtos/order.dto';
import { HttpException } from '@/exceptions/HttpException';

import { PrismaClient, Order, User, Product, OrderStatus } from '@prisma/client';

class OrderService {
  public order = new PrismaClient().order;
  public user = new PrismaClient().user;
  public product = new PrismaClient().product;
  public itemOrder = new PrismaClient().itemOrder;
  //buy servie

  public async addOrder(user: User, orderData: AddOrderDto) {
    try {
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

      await this.order.create({
        data: {
          totalPrice: orderData.totalPrice,
          itemOrder: {
            create: orderData.products.map(item => {
              return {
                totalItem: item.totalProduct,
                totalPriceItem: item.totalProductPrice,
                product: {
                  connect: {
                    id: item.productId,
                  },
                },
              };
            }),
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
    } catch (error) {
      throw new HttpException(500, `${error.message}`);
    }

    return 'Sukses';
  }

  public async findOrderById(orderId: string): Promise<Order> {
    try {
      const findOrderById: Order = await this.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          itemOrder: true,
        },
      });

      return findOrderById;
    } catch (error) {
      throw new HttpException(500, `${error.message}`);
    }
  }

  public async searchOrders(user: User, page: number, size: number, categoryId: string, status: number) {
    try {
      let orderStatus: OrderStatus | undefined;

      switch (status) {
        case 1:
          orderStatus = 'PENDING';
          break;
        case 2:
          orderStatus = 'PROCESS';
          break;
        case 3:
          orderStatus = 'SUCCESS';
          break;
        case 4:
          orderStatus = 'CANCELED';
        default:
          orderStatus = undefined;
      }

      return await this.order.findMany({
        skip: page,
        take: size,
        where: {
          user: {
            id: {
              equals: user.role === 'ADMIN' ? undefined : user.id,
            },
          },
          itemOrder: {
            every: {
              product: {
                categories: {
                  every: {
                    id: categoryId,
                  },
                },
              },
            },
          },
          status: {
            equals: orderStatus,
          },
        },
      });
    } catch (error) {
      throw new HttpException(500, `${error.message}`);
    }
  }

  public async paymentOrders(user: User, orderId: string) {
    try {
      return await this.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: {
            set: 'PROCESS',
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(500, `${error.message}`);
      } else {
        throw new HttpException(500, `${error.message}`);
      }
    }
  }
}

export default OrderService;
