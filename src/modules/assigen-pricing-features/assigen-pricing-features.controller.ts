import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AssigenPricingFeaturesService } from './assigen-pricing-features.service';
import {
  AssignPricingFeatureResponseDto,
  CreateAssigenPricingFeatureDto,
} from './dto/create-assigen-pricing-feature.dto';
import { UpdateAssigenPricingFeatureDto } from './dto/update-assigen-pricing-feature.dto';
import { GetAssignPricingFeatureDto } from './dto/get-assigen-pricing-feature.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
// import { AssignPricingFeatureResponseDto } from './dto/assigen-pricing-feature-response.dto';
import type { Request } from 'express';

@Controller('assigen-pricing-features')
export class AssigenPricingFeaturesController {
  constructor(
    private readonly assigenPricingFeaturesService: AssigenPricingFeaturesService,
  ) {}

  @ApiDoc({
    summary: 'Assign Pricing Feature',
    description: 'Assign a pricing feature to a pricing.',
    response: AssignPricingFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ASSIGEN_PRICING_FEATURE_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createDto: CreateAssigenPricingFeatureDto,
  ) {
    return this.assigenPricingFeaturesService.create(req, createDto);
  }

  @ApiDoc({
    summary: 'Get all Assigned Pricing Features',
    description: 'Retrieve all assigned pricing features with pagination.',
    response: AssignPricingFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ASSIGEN_PRICEN_FEATURE_READ)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get()
  findAll(@Query() query: GetAssignPricingFeatureDto) {
    return this.assigenPricingFeaturesService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get Assigned Pricing Feature',
    description: 'Retrieve a single assigned pricing feature by UUID.',
    response: AssignPricingFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ASSIGEN_PRICEN_FEATURE_READ)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assigenPricingFeaturesService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Assigned Pricing Feature',
    description: 'Update assigned pricing feature.',
    response: AssignPricingFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ASSIGEN_PRICEN_FEATURE_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAssigenPricingFeatureDto,
  ) {
    return this.assigenPricingFeaturesService.update(id, updateDto);
  }

  @ApiDoc({
    summary: 'Delete Assigned Pricing Feature',
    description: 'Soft delete assigned pricing feature.',
    response: AssignPricingFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ASSIGEN_PRICEN_FEATURE_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assigenPricingFeaturesService.remove(id);
  }
}
