import { Test, TestingModule } from '@nestjs/testing';
import { ServiceWorkGalleriesService } from './service-work-galleries.service';

describe('ServiceWorkGalleriesService', () => {
  let service: ServiceWorkGalleriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceWorkGalleriesService],
    }).compile();

    service = module.get<ServiceWorkGalleriesService>(ServiceWorkGalleriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
