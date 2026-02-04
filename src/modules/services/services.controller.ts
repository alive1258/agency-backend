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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, ServiceResponseDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetServiceDto } from './dto/get-service.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiDoc({
    summary: 'Create Service',
    description: 'Creates a new service. Requires proper permission.',
    response: ServiceResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICES_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
    @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.servicesService.create(req, createServiceDto, file);
  }

  @ApiDoc({
    summary: 'Get all Services',
    description: 'Retrieves all services. Supports pagination and filters.',
    response: ServiceResponseDto,
    status: HttpStatus.OK,
  })
  // @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get()
  findAll(@Query() query: GetServiceDto) {
    return this.servicesService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Service',
    description: 'Retrieve a single service by UUID.',
    response: ServiceResponseDto,
    status: HttpStatus.OK,
  })
  // @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Service',
    description: 'Updates an existing service. Requires proper permission.',
    response: ServiceResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICES_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.servicesService.update(id, updateServiceDto, file);
  }

  @ApiDoc({
    summary: 'Delete Service',
    description: 'Soft deletes a service. Requires proper permission.',
    response: ServiceResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICES_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id);
  }
}
