import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PricingsService } from './pricings.service';
import { CreatePricingDto, PricingResponseDto } from './dto/create-pricing.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { GetPricingDto } from './dto/get-pricing.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('pricings')
export class PricingsController {
  constructor(private readonly pricingsService: PricingsService) {}

  @ApiDoc({
    summary: 'Create Pricing',
    description: 'Creates a new pricing record. Requires proper permission.',
    response: PricingResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRICINGS_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
    @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(@Req() req: Request, @Body() createPricingDto: CreatePricingDto) {
    return this.pricingsService.create(req, createPricingDto);
  }

  @ApiDoc({
    summary: 'Get all Pricings',
    description:
      'Retrieves all pricing records. Supports pagination and filters.',
    response: PricingResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetPricingDto) {
    return this.pricingsService.findAll(query);
  }


  @ApiDoc({
    summary: 'Get single Pricing',
    description: 'Retrieve a single pricing record by ID.',
    response: PricingResponseDto,
    status: HttpStatus.OK,
  })
  // @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingsService.findOne(id);
  }

    @ApiDoc({
    summary: 'Get single Pricing',
    description: 'Retrieve a single pricing record by ID.',
    response: PricingResponseDto,
    status: HttpStatus.OK,
  })
  // @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get('details/:id')
  findPricingDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingsService.findPricingDetails(id);
  }

  @ApiDoc({
    summary: 'Update Pricing',
    description:
      'Updates an existing pricing record. Requires proper permission.',
    response: PricingResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRICINGS_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
    @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePricingDto: UpdatePricingDto,
  ) {
    return this.pricingsService.update(id, updatePricingDto);
  }

  @ApiDoc({
    summary: 'Delete Pricing',
    description: 'Soft deletes a pricing record. Requires proper permission.',
    response: PricingResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRICINGS_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
    @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingsService.remove(id);
  }
}
