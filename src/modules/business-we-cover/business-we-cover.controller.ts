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
import { BusinessWeCoverService } from './business-we-cover.service';
import {
  CreateBusinessWeCoverDto,
  BusinessWeCoverResponseDto,
} from './dto/create-business-we-cover.dto';
import { UpdateBusinessWeCoverDto } from './dto/update-business-we-cover.dto';
import { GetBusinessWeCoverDto } from './dto/get-business-we-cover.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';

@Controller('business-we-cover')
export class BusinessWeCoverController {
  constructor(
    private readonly businessWeCoverService: BusinessWeCoverService,
  ) {}

  @ApiDoc({
    summary: 'Create business category',
    description: 'Creates a new business category. Requires proper permission.',
    response: BusinessWeCoverResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BUSINESS_WC_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createBusinessWeCoverDto: CreateBusinessWeCoverDto,
  ) {
    return this.businessWeCoverService.create(req, createBusinessWeCoverDto);
  }

  @ApiDoc({
    summary: 'Get all business categories',
    description:
      'Retrieves all business categories. Supports pagination & filters.',
    response: BusinessWeCoverResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get()
  findAll(@Query() query: GetBusinessWeCoverDto) {
    return this.businessWeCoverService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single business category',
    description: 'Retrieve a single business category by ID.',
    response: BusinessWeCoverResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessWeCoverService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update business category',
    description:
      'Updates an existing business category. Requires proper permission.',
    response: BusinessWeCoverResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BUSINESS_WC_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBusinessWeCoverDto: UpdateBusinessWeCoverDto,
  ) {
    return this.businessWeCoverService.update(id, updateBusinessWeCoverDto);
  }

  @ApiDoc({
    summary: 'Delete business category',
    description:
      'Soft deletes a business category. Requires proper permission. Cannot delete if dependencies exist.',
    response: BusinessWeCoverResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BUSINESS_WC_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessWeCoverService.remove(id);
  }
}
