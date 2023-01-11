import { CreateProductDto } from '@/dtos/product.dto';
import { HttpException } from '@/exceptions/HttpException';
import { PrismaClient, Product } from '@prisma/client';

class ProductService {
  public product = new PrismaClient().product;

  public async checkProductIsExist(id: string) {
    try {
      const findProduct: Product = await this.product.findUnique({
        where: {
          id: id,
        },
      });
      if (!findProduct) throw new HttpException(404, `Product doesn't exist`);

      return findProduct;
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  public async searchProduct(page: number, size: number, key: string, categoryId: string): Promise<Product[]> {
    const checkCategoryId = categoryId === '' ? undefined : categoryId;

    if (key !== '') {
      try {
        const findProductWithKey: Product[] = await this.product.findMany({
          take: size,
          orderBy: {
            name: 'asc',
          },
          where: {
            name: {
              contains: key,
              mode: 'insensitive',
            },
            categories: {
              every: {
                id: checkCategoryId,
              },
            },
          },
          include: {
            categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return findProductWithKey;
      } catch (error) {
        throw new HttpException(500, error.message);
      }
    } else {
      try {
        const findProduct: Product[] = await this.product.findMany({
          skip: page,
          take: size,
          orderBy: {
            name: 'asc',
          },
          where: {
            categories: {
              every: {
                id: checkCategoryId,
              },
            },
          },
          include: {
            categories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return findProduct;
      } catch (error) {
        throw new HttpException(500, error.message);
      }
    }
  }

  public async findProductById(id: string) {
    const findProduct: Product = await this.checkProductIsExist(id);

    return findProduct;
  }

  public async createProduct(productData: CreateProductDto): Promise<Product> {
    const findProduct: Product = await this.product.findFirst({
      where: {
        name: productData.name,
      },
    });
    if (findProduct) throw new HttpException(400, `Product ${productData.name} already exits`);

    try {
      const createProduct: Product = await this.product.create({
        data: {
          name: productData.name,
          imageName: productData.imageName,
          price: productData.price,
          quanty: productData.quanty,
          description: productData.description,
          categories: {
            connect: {
              id: productData.categoryId,
            },
          },
        },
      });
      return createProduct;
    } catch (error) {
      throw new HttpException(400, `${error.message}`);
    }
  }

  public async updateProduct(id: string, productData: CreateProductDto) {
    await this.checkProductIsExist(id);

    const updateProduct: Product = await this.product.update({
      where: {
        id: id,
      },
      data: {
        name: productData.name,
        quanty: productData.quanty,
        price: productData.price,
        description: productData.description,
        imageName: productData.imageName,
        categories: {
          connect: {
            id: productData.categoryId,
          },
        },
      },
    });

    return updateProduct;
  }

  public async deleteProduct(id: string): Promise<Product> {
    await this.checkProductIsExist(id);

    const deleteCategory: Product = await this.product.delete({
      where: {
        id: id,
      },
    });

    return deleteCategory;
  }
}

export default ProductService;
