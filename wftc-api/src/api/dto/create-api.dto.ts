import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateApiDto {
  @IsNotEmpty()
  @IsDate()
  datetime: Date;

  @IsNotEmpty()
  @IsString()
  location: string;

}