import { Injectable } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiService {
    constructor(private prisma: PrismaService) {}

    async create(createApiDto: CreateApiDto) {
        return this.prisma.searchHistory.create({
        data: createApiDto,
        });
    }

    async findAll() {
        return this.prisma.searchHistory.findMany();
      }
    
}