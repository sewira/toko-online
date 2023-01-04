import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  public name: string;
}

export class SearchPaginationDto {
  @IsNumberString()
  public size: number;

  @IsNumberString()
  public page: number;

  @IsString()
  @IsOptional()
  public key: string;
}
