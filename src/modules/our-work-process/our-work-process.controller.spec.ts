import { Test, TestingModule } from '@nestjs/testing';
import { OurWorkProcessController } from './our-work-process.controller';
import { OurWorkProcessService } from './our-work-process.service';

describe('OurWorkProcessController', () => {
  let controller: OurWorkProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OurWorkProcessController],
      providers: [OurWorkProcessService],
    }).compile();

    controller = module.get<OurWorkProcessController>(OurWorkProcessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
