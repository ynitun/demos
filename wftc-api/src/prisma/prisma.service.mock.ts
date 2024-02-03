// prisma.service.mock.ts
export const prismaServiceMock = {
  searchHistory: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};