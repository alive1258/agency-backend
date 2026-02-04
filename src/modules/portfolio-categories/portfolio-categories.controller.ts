import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Req,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { PortfolioCategoriesService } from './portfolio-categories.service';
import {
  CreatePortfolioCategoryDto,
  PortfolioCategoryResponseDto,
} from './dto/create-portfolio-category.dto';
import { UpdatePortfolioCategoryDto } from './dto/update-portfolio-category.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permission } from 'src/auth/enums/permission-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role-type.enum';

@Controller('portfolio-categories')
export class PortfolioCategoriesController {
  constructor(
    private readonly portfolioCategoriesService: PortfolioCategoriesService,
  ) {}

  // ---------------- CREATE ----------------
  @ApiDoc({
    summary: 'Create portfolio category',
    description:
      'Creates a new portfolio category. Requires proper permission.',
    response: PortfolioCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PORTFOLIO_CATEGORY_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Post('create')
  async create(
    @Req() req: Request,
    @Body() createPortfolioCategoryDto: CreatePortfolioCategoryDto,
  ) {
    return this.portfolioCategoriesService.create(
      req,
      createPortfolioCategoryDto,
    );
  }

  // ---------------- GET ALL ----------------
  @ApiDoc({
    summary: 'Get all portfolio categories',
    description: 'Fetch all portfolio categories with optional filters.',
    response: PortfolioCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  async findAll(@Query() query: any) {
    return this.portfolioCategoriesService.findAll(query);
  }

  // ---------------- GET ONE ----------------
  @ApiDoc({
    summary: 'Get single portfolio category',
    description: 'Fetch a single portfolio category by UUID.',
    response: PortfolioCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.portfolioCategoriesService.findOne(id);
  }

  // ---------------- UPDATE ----------------
  @ApiDoc({
    summary: 'Update portfolio category',
    description: 'Update a portfolio category. Requires admin permission.',
    response: PortfolioCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @RequirePermissions(Permission.PORTFOLIO_CATEGORY_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePortfolioCategoryDto: UpdatePortfolioCategoryDto,
  ) {
    return this.portfolioCategoriesService.update(
      id,
      updatePortfolioCategoryDto,
    );
  }

  // ---------------- DELETE ----------------
  @ApiDoc({
    summary: 'Delete portfolio category',
    description: 'Delete a portfolio category. Requires admin permission.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PORTFOLIO_CATEGORY_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.portfolioCategoriesService.remove(id);
  }
}
