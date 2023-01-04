import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './global.dto';

export class CreateProductDto {
  @IsString()
  public name: string;

  @IsNumber()
  public price: number;

  @IsNumber()
  public quanty: number;

  @IsString()
  public imageName: string;

  @IsOptional()
  @IsString()
  public description: string;

  @IsString({
    message: `categoryId is required`,
  })
  public categoryId: string;
}

export class ProductPaginationDto extends PaginationDto {
  @IsString()
  @IsOptional()
  public categoryId: string;
}
