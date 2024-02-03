import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaServiceMock } from '../prisma/prisma.service.mock';

describe('ApiService', () => {
  let service: ApiService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<ApiService>(ApiService);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  const date = new Date((new Date()).getTime() + 24*60*60*1000);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const createApiDto = {
        "id": 1,
        "datetime": date,
        "location": "loc 1"
      };

      jest.spyOn(prismaService.searchHistory, 'create').mockResolvedValueOnce(createApiDto);

      const result = await service.create(createApiDto);

      expect(result).toEqual(createApiDto);
      expect(prismaService.searchHistory.create).toHaveBeenCalledWith({
        data: createApiDto,
      });
    });
  });

  describe('findRecent', () => {
    it('should return recent records', async () => {
      const recentRecords = [
        { id: 1, datetime: date, location: 'Location 1' },
        { id: 2, datetime: date, location: 'Location 2' },
      ];

      jest.spyOn(prismaService.searchHistory, 'findMany').mockResolvedValueOnce(recentRecords);

      const result = await service.findRecent();

      expect(result).toEqual(recentRecords);
      expect(prismaService.searchHistory.findMany).toHaveBeenCalledWith({
        orderBy: {
          datetime: 'desc',
        },
        take: 10,
      });
    });
  });

  describe('findPeriod', () => {
    it('should return records for a specific period', async () => {
      const startDate = '2024-01-30T00:00:00';
      const endDate = '2024-02-30T00:00:00';

      const periodRecords = [
        { id: 1, datetime: date, location: 'Location 1' },
        { id: 2, datetime: date, location: 'Location 2' },
      ];

      jest.spyOn(prismaService.searchHistory, 'findMany').mockResolvedValueOnce(periodRecords);

      const result = await service.findPeriod(startDate, endDate);

      expect(result).toEqual(periodRecords);
      expect(prismaService.searchHistory.findMany).toHaveBeenCalledWith({
        where: {
          datetime: {
            gte: expect.any(String),
            lte: expect.any(String),
          },
        },
        orderBy: {
          datetime: 'desc',
        },
        take: 10,
      });
    });
  });

  

});
