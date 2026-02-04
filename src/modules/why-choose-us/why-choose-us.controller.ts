import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WhyChooseUsService } from './why-choose-us.service';
import {
  CreateWhyChooseUsDto,
  WhyChooseUsResponseDto,
} from './dto/create-why-choose-us.dto';
import { UpdateWhyChooseUsDto } from './dto/update-why-choose-us.dto';
import { GetWhyChooseUsDto } from './dto/get-why-choose-us.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';

@Controller('why-choose-us')
export class WhyChooseUsController {
  constructor(private readonly whyChooseUsService: WhyChooseUsService) {}

  @ApiDoc({
    summary: 'Create Why Choose Us',
    description:
      'Creates a new Why Choose Us record. Requires proper permission.',
    response: WhyChooseUsResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WHY_CHOOSE_US_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createWhyChooseUsDto: CreateWhyChooseUsDto,
  ) {
    return this.whyChooseUsService.create(req, createWhyChooseUsDto);
  }

  @ApiDoc({
    summary: 'Get all Why Choose Us records',
    description:
      'Retrieves all Why Choose Us records. Supports pagination & filters.',
    response: WhyChooseUsResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetWhyChooseUsDto) {
    return this.whyChooseUsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Why Choose Us',
    description: 'Retrieve a single Why Choose Us record by ID.',
    response: WhyChooseUsResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.whyChooseUsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Why Choose Us',
    description:
      'Updates an existing Why Choose Us record. Requires proper permission.',
    response: WhyChooseUsResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WHY_CHOOSE_US_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWhyChooseUsDto: UpdateWhyChooseUsDto,
  ) {
    return this.whyChooseUsService.update(id, updateWhyChooseUsDto);
  }

  @ApiDoc({
    summary: 'Delete Why Choose Us',
    description:
      'Soft deletes a Why Choose Us record. Requires proper permission.',
    response: WhyChooseUsResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WHY_CHOOSE_US_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.whyChooseUsService.remove(id);
  }
}
