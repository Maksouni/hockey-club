import { Module } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { TrainingsController } from './trainings.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TrainingsController],
  providers: [TrainingsService, PrismaService],
})
export class TrainingsModule {}
