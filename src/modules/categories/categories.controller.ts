import { GetCategoryDto } from './dto/get-category.dto';
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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CategoryResponseDto,
  CreateCategoryDto,
} from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role-type.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiDoc({
    summary: 'Create category',
    description: 'Creates a new category. Requires proper permission.',
    response: CategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.CATEGORY_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Post('create')
  async create(
    @Req() req: Request,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(req, createCategoryDto);
  }

  @ApiDoc({
    summary: 'Get All category',
    description: 'Get All category. Requires proper permission.',
    response: CategoryResponseDto,
    status: HttpStatus.OK,
  })
  
  @Get()
  async findAll(@Query() query: GetCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get singel category',
    description: 'Get singel category. Requires proper permission.',
    response: CategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }
  @ApiDoc({
    summary: 'Create category',
    description: 'Creates a new category. Requires proper permission.',
    response: CategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Roles(Role.ADMIN, Role.SUPER_ADMIN) // broad RBAC
  @RequirePermissions(Permission.CATEGORY_UPDATE) // fine-grained action
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
  @RequirePermissions(Permission.CATEGORY_DELETE) // fine-grained action
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
