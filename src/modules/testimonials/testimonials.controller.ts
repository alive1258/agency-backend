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
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto, TestimonialResponseDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { GetTestimonialDto } from './dto/get-testimonial.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @ApiDoc({
    summary: 'Create Testimonial',
    description: 'Creates a new testimonial. Requires proper permission.',
    response: TestimonialResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.TESTIMONIALS_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createTestimonialDto: CreateTestimonialDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.testimonialsService.create(req, createTestimonialDto, file);
  }

  @ApiDoc({
    summary: 'Get all Testimonials',
    description: 'Retrieves all testimonials. Supports pagination and filters.',
    response: TestimonialResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetTestimonialDto) {
    return this.testimonialsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Testimonial',
    description: 'Retrieve a single testimonial by UUID.',
    response: TestimonialResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.testimonialsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Testimonial',
    description: 'Updates an existing testimonial. Requires proper permission.',
    response: TestimonialResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.TESTIMONIALS_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.testimonialsService.update(id, updateTestimonialDto, file);
  }

  @ApiDoc({
    summary: 'Delete Testimonial',
    description: 'Soft deletes a testimonial. Requires proper permission.',
    response: TestimonialResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.TESTIMONIALS_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.testimonialsService.remove(id);
  }
}
