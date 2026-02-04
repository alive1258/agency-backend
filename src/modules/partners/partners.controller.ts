import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import { Throttle } from '@nestjs/throttler';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @ApiDoc({
    summary: 'Create Partner',
    description: 'Creates a new partner. Requires proper permission.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PARTNERS_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(@Req() req: Request, @Body() createPartnerDto: CreatePartnerDto, @UploadedFile() file?: Express.Multer.File) {
    return this.partnersService.create(req, createPartnerDto, file);
  }

  @ApiDoc({
    summary: 'Get all Partners',
    description: 'Retrieves all partners.',
    status: HttpStatus.OK,
  })
  @Get()
  findAll() {
    return this.partnersService.findAll();
  }

  @ApiDoc({
    summary: 'Get single Partner',
    description: 'Retrieve a single partner by ID.',
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnersService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Partner',
    description: 'Updates an existing partner. Requires proper permission.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PARTNERS_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto, @UploadedFile() file?: Express.Multer.File) {
    return this.partnersService.update(id, updatePartnerDto, file);
  }

  @ApiDoc({
    summary: 'Delete Partner',
    description: 'Soft deletes a partner. Requires proper permission.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PARTNERS_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}
