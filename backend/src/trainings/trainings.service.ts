import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';

@Injectable()
export class TrainingsService {
  constructor(private prisma: PrismaService) {}

  create(createTrainingDto: CreateTrainingDto) {
    return this.prisma.trainings.create({
      data: {
        title: createTrainingDto.title,
        description: createTrainingDto.description,
        training_date: new Date(createTrainingDto.training_date),
        location: createTrainingDto.location,
        duration: createTrainingDto.duration,
        coach_id: createTrainingDto.coach_id,
      },
    });
  }

  findAll() {
    return this.prisma.trainings.findMany();
  }

  findOne(id: number) {
    return this.prisma.trainings.findUnique({
      where: { id },
    });
  }

  update(id: number, updateTrainingDto: UpdateTrainingDto) {
    return this.prisma.trainings.update({
      where: { id },
      data: {
        ...updateTrainingDto,
        training_date: updateTrainingDto.training_date
          ? new Date(updateTrainingDto.training_date)
          : undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.trainings.delete({
      where: { id },
    });
  }
}
