import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DivisionService } from './divisions.service';

@Controller('divisions')
@ApiTags('Divisions')
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) {}

  /**
   * Get all division controller
   */
  @Get()
  @ApiOperation({
    summary: 'Get all the data.',
  })
  findAll() {
    return this.divisionService.findAll();
  }
}
