import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('/create')
  async create(@Body() createApiDto: CreateApiDto) {
    return this.apiService.create(createApiDto);
  }
  
  @Get('/reports/recent')
  async findRecent() {
    return this.apiService.findRecent();   
  }

  @Get('/reports/period?')
  async findPeriod(
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string) {
    return this.apiService.findPeriod(start_date, end_date);  
  }

  @Get('/reports/most?')
  async findMost(
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string) {
    return this.apiService.findMost(start_date, end_date);   
  }
}