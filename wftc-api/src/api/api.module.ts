import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [PrismaModule]
})
export class ApiModule {}
