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

import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { BlogCategoryResponseDto } from '../blog-categories/dto/create-blog-category.dto';
import { GetBlogCategoryDto } from '../blog-categories/dto/get-blog-category.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @ApiDoc({
    summary: 'Create Blog',
    description: 'Creates a new blog. Requires proper permission.',
    response: BlogCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BLOGS_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogsService.create(req, createBlogDto, file);
  }

  @ApiDoc({
    summary: 'Get all Blogs',
    description: 'Retrieves all blogs. Supports pagination and filters.',
    response: BlogCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetBlogCategoryDto) {
    return this.blogsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Blog',
    description: 'Retrieve a single blog by UUID.',
    response: BlogCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Blog',
    description: 'Updates an existing blog. Requires proper permission.',
    response: BlogCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BLOGS_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogsService.update(id, updateBlogDto, file);
  }

  @ApiDoc({
    summary: 'Delete Blog',
    description: 'Soft deletes a blog. Requires proper permission.',
    response: BlogCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BLOGS_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogsService.remove(id);
  }
}
