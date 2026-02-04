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
import { BlogCategoriesService } from './blog-categories.service';
import {
  BlogCategoryResponseDto,
  CreateBlogCategoryDto,
} from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permission } from 'src/auth/enums/permission-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role-type.enum';
import type { Request } from 'express';
import { GetBlogCategoryDto } from './dto/get-blog-category.dto';

@Controller('blog-categories')
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

  // ---------------- CREATE ----------------
  @ApiDoc({
    summary: 'Create blog category',
    description: 'Creates a new blog category. Requires proper permission.',
    response: BlogCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BLOG_CATEGORY_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Post('create')
  async create(
    @Req() req: Request,
    @Body() createBlogCategoryDto: CreateBlogCategoryDto,
  ) {
    return this.blogCategoriesService.create(req, createBlogCategoryDto);
  }

  // ---------------- GET ALL ----------------
  @ApiDoc({
    summary: 'Get all blog categories',
    description: 'Fetch all blog categories with pagination/filter.',
    response: BlogCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  async findAll(@Query() query: GetBlogCategoryDto) {
    return this.blogCategoriesService.findAll(query);
  }

  // ---------------- GET ONE ----------------
  @ApiDoc({
    summary: 'Get single blog category',
    description: 'Fetch a single blog category by ID.',
    response: BlogCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogCategoriesService.findOne(id);
  }

  // ---------------- UPDATE ----------------
  @ApiDoc({
    summary: 'Update blog category',
    description: 'Update a blog category. Requires admin permission.',
    response: BlogCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @RequirePermissions(Permission.BLOG_CATEGORY_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogCategoryDto: UpdateBlogCategoryDto,
  ) {
    return this.blogCategoriesService.update(id, updateBlogCategoryDto);
  }

  // ---------------- DELETE ----------------
  @ApiDoc({
    summary: 'Delete blog category',
    description: 'Delete a blog category. Requires admin permission.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BLOG_CATEGORY_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.blogCategoriesService.remove(id);
  }
}
