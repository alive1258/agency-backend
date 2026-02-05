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
import type { Request } from 'express';

import { ServiceFaqsService } from './service-faqs.service';

import {
  CreateServiceFaqDto,
  ServiceFaqResponseDto,
} from './dto/create-service-faq.dto';
import { UpdateServiceFaqDto } from './dto/update-service-faq.dto';
import { GetServiceFaqDto } from './dto/get-service-faq.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

@Controller('service-faqs')
export class ServiceFaqsController {
  constructor(private readonly serviceFaqsService: ServiceFaqsService) {}

  // ===============================
  // Create Service FAQ
  // ===============================
  @ApiDoc({
    summary: 'Create Service FAQ',
    description: 'Creates a new Service FAQ. Requires proper permission.',
    response: ServiceFaqResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICE_FAQ_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createServiceFaqDto: CreateServiceFaqDto,
  ) {
    return this.serviceFaqsService.create(req, createServiceFaqDto);
  }

  // ===============================
  // Get All Service FAQs
  // ===============================
  @ApiDoc({
    summary: 'Get all Service FAQs',
    description: 'Retrieves all Service FAQs with pagination & filters.',
    response: ServiceFaqResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetServiceFaqDto) {
    return this.serviceFaqsService.findAll(query);
  }

  // ===============================
  // Get Single Service FAQ
  // ===============================
  @ApiDoc({
    summary: 'Get single Service FAQ',
    description: 'Retrieves a Service FAQ by UUID.',
    response: ServiceFaqResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceFaqsService.findOne(id);
  }

  // ===============================
  // Update Service FAQ
  // ===============================
  @ApiDoc({
    summary: 'Update Service FAQ',
    description: 'Updates an existing Service FAQ. Requires proper permission.',
    response: ServiceFaqResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICE_FAQ_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceFaqDto: UpdateServiceFaqDto,
  ) {
    return this.serviceFaqsService.update(id, updateServiceFaqDto);
  }

  // ===============================
  // Delete (Soft) Service FAQ
  // ===============================
  @ApiDoc({
    summary: 'Delete Service FAQ',
    description: 'Soft deletes a Service FAQ. Requires proper permission.',
    response: ServiceFaqResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICE_FAQ_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceFaqsService.remove(id);
  }
}
