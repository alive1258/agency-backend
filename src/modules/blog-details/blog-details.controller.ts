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

import { BlogDetailsService } from './blog-details.service';
import {
  BlogDetailResponseDto,
  CreateBlogDetailDto,
} from './dto/create-blog-detail.dto';
import { UpdateBlogDetailDto } from './dto/update-blog-detail.dto';
import { GetBlogDetailDto } from './dto/get-blog-detail.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('blog-details')
export class BlogDetailsController {
  constructor(private readonly blogDetailsService: BlogDetailsService) {}

  @ApiDoc({
    summary: 'Create Blog Detail',
    description: 'Creates a new blog detail. Requires proper permission.',
    response: BlogDetailResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BLOG_DETAILS_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createBlogDetailDto: CreateBlogDetailDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogDetailsService.create(req, createBlogDetailDto, file);
  }

  @ApiDoc({
    summary: 'Get all Blog Details',
    description: 'Retrieves all blog details. Supports pagination and filters.',
    response: BlogDetailResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetBlogDetailDto) {
    return this.blogDetailsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Blog Detail',
    description: 'Retrieve a single blog detail by UUID.',
    response: BlogDetailResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogDetailsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Blog Detail',
    description: 'Updates an existing blog detail. Requires proper permission.',
    response: BlogDetailResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BLOG_DETAILS_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlogDetailDto: UpdateBlogDetailDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogDetailsService.update(id, updateBlogDetailDto, file);
  }

  @ApiDoc({
    summary: 'Delete Blog Detail',
    description: 'Soft deletes a blog detail. Requires proper permission.',
    response: BlogDetailResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BLOG_DETAILS_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogDetailsService.remove(id);
  }
}
