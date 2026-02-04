import { Controller, Get } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpzelaService } from './upzelas.service';

@Controller('upzelas')
@ApiTags('Upzelas')
export class UpzelasController {
  constructor(private readonly UpzelaService: UpzelaService) {}

  /**
   * Get all Upzela controller
   */
  @Get()
  @ApiOperation({
    summary: 'Get all the data.',
  })
  findAll() {
    return this.UpzelaService.findAll();
  }
}
