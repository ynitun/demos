import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post()
  async create(@Body() createApiDto: CreateApiDto) {
    return this.apiService.create(createApiDto);
  }
  
  @Get()
  async findAll() {
    return this.apiService.findAll();
  }
}