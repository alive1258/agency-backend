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
import { PricingFeaturesService } from './pricing-features.service';
import {
  CreatePricingFeatureDto,
  PricingFeatureResponseDto,
} from './dto/create-pricing-feature.dto';
import { UpdatePricingFeatureDto } from './dto/update-pricing-feature.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { GetPricingFeaturesDto } from './dto/get-pricing-feature.dto';

@Controller('pricing-features')
export class PricingFeaturesController {
  constructor(
    private readonly pricingFeaturesService: PricingFeaturesService,
  ) {}

  @ApiDoc({
    summary: 'Create Pricing Feature',
    description: 'Creates a new Pricing Feature. Requires proper permission.',
    response: PricingFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRICING_FEATURE_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createPricingFeatureDto: CreatePricingFeatureDto,
  ) {
    return this.pricingFeaturesService.create(req, createPricingFeatureDto);
  }

  @ApiDoc({
    summary: 'Get all Pricing Features',
    description:
      'Retrieves all Pricing Features. Supports pagination & filters.',
    response: PricingFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetPricingFeaturesDto) {
    return this.pricingFeaturesService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Pricing Feature',
    description: 'Retrieve a single Pricing Feature by ID.',
    response: PricingFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingFeaturesService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Pricing Feature',
    description:
      'Updates an existing Pricing Feature. Requires proper permission.',
    response: PricingFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRICING_FEATURE_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePricingFeatureDto: UpdatePricingFeatureDto,
  ) {
    return this.pricingFeaturesService.update(id, updatePricingFeatureDto);
  }

  @ApiDoc({
    summary: 'Delete Pricing Feature',
    description: 'Soft deletes a Pricing Feature. Requires proper permission.',
    response: PricingFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRICING_FEATURE_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingFeaturesService.remove(id);
  }
}
