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
import { ServiceReviewsService } from './service-reviews.service';
import {
  CreateServiceReviewDto,
  ServiceReviewResponseDto,
} from './dto/create-service-review.dto';
import { UpdateServiceReviewDto } from './dto/update-service-review.dto';
import { GetServiceReviewDto } from './dto/get-service-review.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('service-reviews')
export class ServiceReviewsController {
  constructor(private readonly serviceReviewsService: ServiceReviewsService) {}

  @ApiDoc({
    summary: 'Create Service Review',
    description: 'Creates a review for a service video.',
    response: ServiceReviewResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICE_REVIEW_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(@Req() req: Request, @Body() createDto: CreateServiceReviewDto) {
    return this.serviceReviewsService.create(req, createDto);
  }

  @ApiDoc({
    summary: 'Get all Service Reviews',
    description: 'Retrieves all service reviews with filters and pagination.',
    response: ServiceReviewResponseDto,
    status: HttpStatus.OK,
  })

  @Get()
  findAll(@Query() query: GetServiceReviewDto) {
    return this.serviceReviewsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Service Review',
    description: 'Retrieve a service review by UUID.',
    response: ServiceReviewResponseDto,
    status: HttpStatus.OK,
  })

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceReviewsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Service Review',
    description: 'Updates an existing service review.',
    response: ServiceReviewResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICE_REVIEW_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateServiceReviewDto,
  ) {
    return this.serviceReviewsService.update(id, updateDto);
  }

  @ApiDoc({
    summary: 'Delete Service Review',
    description: 'Soft deletes a service review.',
    response: ServiceReviewResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICE_REVIEW_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceReviewsService.remove(id);
  }
}

