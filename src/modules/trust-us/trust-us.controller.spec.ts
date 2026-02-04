import { Test, TestingModule } from '@nestjs/testing';
import { TrustUsController } from './trust-us.controller';
import { TrustUsService } from './trust-us.service';

describe('TrustUsController', () => {
  let controller: TrustUsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrustUsController],
      providers: [TrustUsService],
    }).compile();

    controller = module.get<TrustUsController>(TrustUsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
