import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ApiService } from './api.service'; 
import { PrismaService } from '../prisma/prisma.service';


describe('ApiController', () => {
  let controller: ApiController;
  let apiService: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [ApiService, PrismaService],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    apiService = module.get<ApiService>(ApiService);
  });

  const date = new Date((new Date()).getTime() + 24*60*60*1000);

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findRecent', () => {
    it('should return recent records', async () => {
      // Mock the findRecent method
  
      jest.spyOn(apiService, 'findRecent').mockResolvedValueOnce([{
        "id": 1,
        "datetime": date,
        "location": "loc 1"
      }]);

      const result = await controller.findRecent();
      const expectedOutput: any[] = [
        {
          id: 1,
          datetime: date,
          location: "loc 1",
        }
      ];
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('findPeriod', () => {
    it('should return records for a specific period', async () => {
      // Mock the findPeriod method of ApiService
      jest.spyOn(apiService, 'findPeriod').mockResolvedValueOnce([{
        "id": 1,
        "datetime": date,
        "location": "loc 1"
      }]);

      // Your test input
      const startDate = '2024-01-30T00:00:00';
      const endDate = '2024-02-30T00:00:00';

      const result = await controller.findPeriod(startDate, endDate);
      console.log(result)
      // Your expected output based on the mocked data
      const expectedOutput: any[] = [
        {
          id: 1,
          datetime: date,
          location: "loc 1",
        }
      ];

      expect(result).toEqual(expectedOutput);
    });
  });
  
});
