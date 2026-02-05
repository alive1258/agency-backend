import { Test, TestingModule } from '@nestjs/testing';
import { ServiceWorkGalleriesController } from './service-work-galleries.controller';
import { ServiceWorkGalleriesService } from './service-work-galleries.service';

describe('ServiceWorkGalleriesController', () => {
  let controller: ServiceWorkGalleriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceWorkGalleriesController],
      providers: [ServiceWorkGalleriesService],
    }).compile();

    controller = module.get<ServiceWorkGalleriesController>(ServiceWorkGalleriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
