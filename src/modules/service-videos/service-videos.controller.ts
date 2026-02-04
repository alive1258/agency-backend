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
import { ServiceVideosService } from './service-videos.service';
import { CreateServiceVideoDto, ServiceVideoResponseDto } from './dto/create-service-video.dto';
import { UpdateServiceVideoDto } from './dto/update-service-video.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetServiceVideoDto } from './dto/get-service-video.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('service-videos')
export class ServiceVideosController {
  constructor(private readonly serviceVideosService: ServiceVideosService) {}

  @ApiDoc({
    summary: 'Create Service Video',
    description: 'Creates a new service video. Requires proper permission.',
    response: ServiceVideoResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICE_VIDEO_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createDto: CreateServiceVideoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.serviceVideosService.create(req, createDto, file);
  }

  @ApiDoc({
    summary: 'Get all Service Videos',
    description: 'Retrieves all service videos with pagination and filters.',
    response: ServiceVideoResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetServiceVideoDto) {
    return this.serviceVideosService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Service Video',
    description: 'Retrieve a single service video by UUID.',
    response: ServiceVideoResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceVideosService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Service Video',
    description: 'Updates an existing service video.',
    response: ServiceVideoResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICE_VIDEO_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateServiceVideoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    
    return this.serviceVideosService.update(id, updateDto, file);
  }

  @ApiDoc({
    summary: 'Delete Service Video',
    description: 'Soft deletes a service video.',
    response: ServiceVideoResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SERVICE_VIDEO_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceVideosService.remove(id);
  }
}
