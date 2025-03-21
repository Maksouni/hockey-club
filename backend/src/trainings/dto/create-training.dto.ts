import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';

export class CreateTrainingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  training_date: Date;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @IsOptional()
  duration?: number;

  @IsInt()
  @IsOptional()
  coach_id?: number;
}
