import { Injectable } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiService {
    post: any;
    constructor(private prisma: PrismaService) {}

    async create(createApiDto: CreateApiDto) {
        return this.prisma.searchHistory.create({
        data: createApiDto,
        });
    }

    async findRecent() {
        return this.prisma.searchHistory.findMany({
        orderBy: {
            datetime: 'desc',
        },
        take: 10,
        });
    }

    async findPeriod(start_date, end_date) {   
        const sd = new Date(start_date);
        sd.setMinutes(sd.getMinutes() - sd.getTimezoneOffset());
        const ed = new Date(end_date);
        ed.setMinutes(ed.getMinutes() - ed.getTimezoneOffset());
    
        return this.prisma.searchHistory.findMany({
        where: {
            datetime: {
                gte: new Date(sd).toISOString(),
                lte: new Date(ed).toISOString(),
            },
        },    
        orderBy: {
            datetime: 'desc',
        },
        take: 10,
        });
    }

    async findMost(start_date, end_date) {      
        const sd = new Date(start_date);
        sd.setMinutes(sd.getMinutes() - sd.getTimezoneOffset());
        const ed = new Date(end_date);
        ed.setMinutes(ed.getMinutes() - ed.getTimezoneOffset());
    
        const searches = await this.prisma.searchHistory.findMany({
        where: {
            datetime: {
                gte: new Date(sd).toISOString(),
                lte: new Date(ed).toISOString(),            
            },
        },
        orderBy: {
            datetime: 'desc',
        },
        });

        //Retrieve the period of which there are most searches performed
        let maxSearches = 0;
        let result = null;

        //Iterate through 1-hour intervals and count searches
        for (let currentHour = sd.getTime(); currentHour <= ed.getTime(); currentHour += 3600000 /* 1 hour in milliseconds */) {
    
            const currentStartTime = new Date(currentHour);
            const currentEndTime = new Date(currentStartTime.getTime() + 3600000 /* 1 hour in milliseconds */);

            const currentSearchCount = searches.filter(search =>
            search.datetime >= currentStartTime && search.datetime < currentEndTime
            ).length;

            // Update maximum searches and start time if needed
            if (currentSearchCount > maxSearches) {
            maxSearches = currentSearchCount;
            result = currentStartTime;
            }
        }
        return result;
    }
    
}