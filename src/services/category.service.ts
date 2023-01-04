import { CreateCategoryDto } from '@/dtos/category.dto';
import { HttpException } from '@/exceptions/HttpException';
import { PrismaClient, ProductCategory } from '@prisma/client';

class CategoryService {
  public category = new PrismaClient().productCategory;

  public async checkCategoryIsExist(id: string) {
    const findCategory: ProductCategory = await this.category.findUnique({
      where: {
        id: id,
      },
      include: {
        product: true,
      },
    });
    if (!findCategory) throw new HttpException(409, `Category doesn't exist`);
  }

  public async searchCategory(page: number, size: number, key: string): Promise<ProductCategory[]> {
    if (key !== '') {
      const findCategory: ProductCategory[] = await this.category.findMany({
        take: size,
        orderBy: {
          name: 'asc',
        },
        where: {
          name: {
            startsWith: key,
            mode: 'insensitive',
          },
        },
      });

      return findCategory;
    } else {
      const searchCategory: ProductCategory[] = await this.category.findMany({
        skip: page,
        take: size,
        orderBy: {
          name: 'asc',
        },
      });

      return searchCategory;
    }
  }

  public async findCategoryById(id: string): Promise<ProductCategory> {
    const findCategory: ProductCategory = await this.category.findUnique({
      where: {
        id: id,
      },
      include: {
        product: true,
      },
    });
    if (!findCategory) throw new HttpException(409, `Category doesn't exist`);

    return findCategory;
  }

  public async createCategory(categoryData: CreateCategoryDto): Promise<ProductCategory> {
    const findCategory: ProductCategory = await this.category.findFirst({
      where: {
        name: categoryData.name,
      },
    });

    if (findCategory) throw new HttpException(409, `Category ${categoryData.name} already exits`);

    const createCategory: ProductCategory = await this.category.create({
      data: {
        name: categoryData.name,
      },
    });

    return createCategory;
  }

  public async updateCategory(categoryId: string, categoryData: CreateCategoryDto): Promise<ProductCategory> {
    await this.checkCategoryIsExist(categoryId);

    const updateCategory: ProductCategory = await this.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: categoryData.name,
      },
    });

    return updateCategory;
  }

  public async deleteCategory(categoryId: string): Promise<ProductCategory> {
    await this.checkCategoryIsExist(categoryId);

    const findCategory: ProductCategory = await this.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!findCategory) throw new HttpException(409, `Category doesn't exist`);

    const deleteCategory = await this.category.delete({
      where: {
        id: categoryId,
      },
    });

    return deleteCategory;
  }
}

export default CategoryService;
