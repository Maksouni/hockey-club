import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  patronymic?: string;

  @IsDateString()
  birthdate: string;

  @IsInt()
  position_id: number;

  @IsInt()
  @IsOptional()
  user_id?: number;
}
