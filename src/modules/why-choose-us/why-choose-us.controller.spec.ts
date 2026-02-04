import { Test, TestingModule } from '@nestjs/testing';
import { WhyChooseUsController } from './why-choose-us.controller';
import { WhyChooseUsService } from './why-choose-us.service';

describe('WhyChooseUsController', () => {
  let controller: WhyChooseUsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhyChooseUsController],
      providers: [WhyChooseUsService],
    }).compile();

    controller = module.get<WhyChooseUsController>(WhyChooseUsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
