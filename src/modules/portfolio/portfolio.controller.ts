import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @ApiDoc({
    summary: 'Create Portfolio',
    description: 'Creates a new portfolio item. Requires proper permission.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PORTFOLIO_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createPortfolioDto: CreatePortfolioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.portfolioService.create(req, createPortfolioDto, file);
  }

  @ApiDoc({
    summary: 'Get all Portfolios',
    description: 'Retrieves all portfolio items.',
    status: HttpStatus.OK,
  })
  @Get()
  findAll() {
    return this.portfolioService.findAll();
  }

  @ApiDoc({
    summary: 'Get single Portfolio',
    description: 'Retrieve a single portfolio item by UUID.',
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.portfolioService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Portfolio',
    description:
      'Updates an existing portfolio item. Requires proper permission.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PORTFOLIO_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.portfolioService.update(id, updatePortfolioDto, file);
  }

  @ApiDoc({
    summary: 'Delete Portfolio',
    description: 'Soft deletes a portfolio item. Requires proper permission.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PORTFOLIO_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.portfolioService.remove(id);
  }
}
