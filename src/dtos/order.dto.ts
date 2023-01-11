import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, Max, Min } from 'class-validator';

export class AddOrderDto {
  //   @Type(() => ProductOrderDto)
  @IsArray()
  public products: ProductOrderDto[];

  @IsNumber()
  public totalPrice: number;
}

export class ProductOrderDto {
  @IsString()
  public productId: string;

  @IsNumber()
  public totalProduct: number;

  @IsNumber()
  public totalProductPrice: number;
}
