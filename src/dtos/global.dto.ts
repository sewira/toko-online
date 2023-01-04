import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsNumberString()
  public size: number;

  @IsNumberString()
  public page: number;

  @IsString()
  @IsOptional()
  public key: string;
}
