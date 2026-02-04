import { Test, TestingModule } from '@nestjs/testing';
import { BusinessWeCoverController } from './business-we-cover.controller';
import { BusinessWeCoverService } from './business-we-cover.service';

describe('BusinessWeCoverController', () => {
  let controller: BusinessWeCoverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessWeCoverController],
      providers: [BusinessWeCoverService],
    }).compile();

    controller = module.get<BusinessWeCoverController>(BusinessWeCoverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
