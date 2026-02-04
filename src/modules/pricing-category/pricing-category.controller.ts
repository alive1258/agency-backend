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
import { PricingCategoryService } from './pricing-category.service';
import {
  CreatePricingCategoryDto,
  PricingCategoryResponseDto,
} from './dto/create-pricing-category.dto';
import { UpdatePricingCategoryDto } from './dto/update-pricing-category.dto';
import { GetPricingCategoryDto } from './dto/get-pricing-category.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';

@Controller('pricing-category')
export class PricingCategoryController {
  constructor(
    private readonly pricingCategoryService: PricingCategoryService,
  ) {}

  @ApiDoc({
    summary: 'Create Pricing Category',
    description: 'Creates a new Pricing Category. Requires proper permission.',
    response: PricingCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRICING_CATEGORY_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createPricingCategoryDto: CreatePricingCategoryDto,
  ) {
    return this.pricingCategoryService.create(req, createPricingCategoryDto);
  }

  @ApiDoc({
    summary: 'Get all Pricing Categories',
    description:
      'Retrieves all Pricing Categories. Supports pagination & filters.',
    response: PricingCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetPricingCategoryDto) {
    return this.pricingCategoryService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Pricing Category',
    description: 'Retrieve a single Pricing Category by ID.',
    response: PricingCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingCategoryService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Pricing Category',
    description:
      'Updates an existing Pricing Category. Requires proper permission.',
    response: PricingCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRICING_CATEGORY_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePricingCategoryDto: UpdatePricingCategoryDto,
  ) {
    return this.pricingCategoryService.update(id, updatePricingCategoryDto);
  }

  @ApiDoc({
    summary: 'Delete Pricing Category',
    description: 'Soft deletes a Pricing Category. Requires proper permission.',
    response: PricingCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRICING_CATEGORY_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingCategoryService.remove(id);
  }
}
