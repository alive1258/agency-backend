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
import type { Request } from 'express';

import { PortfolioDetailsService } from './portfolio-details.service';
import {
  PortfolioDetailResponseDto,
  CreatePortfolioDetailDto,
} from './dto/create-portfolio-detail.dto';
import { UpdatePortfolioDetailDto } from './dto/update-portfolio-detail.dto';
import { GetPortfolioDetailDto } from './dto/get-portfolio-detail.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('portfolio-details')
export class PortfolioDetailsController {
  constructor(
    private readonly portfolioDetailsService: PortfolioDetailsService,
  ) {}

  // ---------------- CREATE ----------------
  @ApiDoc({
    summary: 'Create Portfolio Detail',
    description: 'Creates a new portfolio detail. Requires proper permission.',
    response: PortfolioDetailResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PORTFOLIO_DETAILS_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createPortfolioDetailDto: CreatePortfolioDetailDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.portfolioDetailsService.create(
      req,
      createPortfolioDetailDto,
      file,
    );
  }

  // ---------------- GET ALL ----------------
  @ApiDoc({
    summary: 'Get all Portfolio Details',
    description:
      'Retrieves all portfolio details. Supports pagination and filters.',
    response: PortfolioDetailResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetPortfolioDetailDto) {
    return this.portfolioDetailsService.findAll(query);
  }

  // ---------------- GET ONE ----------------
  @ApiDoc({
    summary: 'Get single Portfolio Detail',
    description: 'Retrieve a single portfolio detail by UUID.',
    response: PortfolioDetailResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.portfolioDetailsService.findOne(id);
  }

  // ---------------- UPDATE ----------------
  @ApiDoc({
    summary: 'Update Portfolio Detail',
    description:
      'Updates an existing portfolio detail. Requires proper permission.',
    response: PortfolioDetailResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PORTFOLIO_DETAILS_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePortfolioDetailDto: UpdatePortfolioDetailDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.portfolioDetailsService.update(
      id,
      updatePortfolioDetailDto,
      file,
    );
  }

  // ---------------- DELETE ----------------
  @ApiDoc({
    summary: 'Delete Portfolio Detail',
    description: 'Soft deletes a portfolio detail. Requires proper permission.',
    response: PortfolioDetailResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PORTFOLIO_DETAILS_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.portfolioDetailsService.remove(id);
  }
}
