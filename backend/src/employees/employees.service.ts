import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    return this.prisma.employees.create({
      data: {
        surname: createEmployeeDto.surname,
        name: createEmployeeDto.name,
        patronymic: createEmployeeDto.patronymic,
        birthdate: new Date(createEmployeeDto.birthdate),
        position_id: createEmployeeDto.position_id,
        user_id: createEmployeeDto.user_id,
      },
    });
  }

  findAll() {
    return this.prisma.employees.findMany();
  }

  findOne(id: number) {
    return this.prisma.employees.findUnique({
      where: { id },
    });
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return this.prisma.employees.update({
      where: { id },
      data: {
        surname: updateEmployeeDto.surname,
        name: updateEmployeeDto.name,
        patronymic: updateEmployeeDto.patronymic,
        birthdate: updateEmployeeDto.birthdate
          ? new Date(updateEmployeeDto.birthdate)
          : undefined,
        position_id: updateEmployeeDto.position_id,
        user_id: updateEmployeeDto.user_id,
      },
    });
  }

  remove(id: number) {
    return this.prisma.employees.delete({
      where: { id },
    });
  }
}
