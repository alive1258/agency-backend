import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DistrictService } from './districts.service';

@Controller('districts')
@ApiTags('Districts')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  /**
   * Get all District controller
   */
  @Get()
  @ApiOperation({
    summary: 'Get all the data.',
  })
  findAll() {
    return this.districtService.findAll();
  }
}
