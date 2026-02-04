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
import { HerosService } from './heros.service';
import { CreateHeroDto, HeroResponseDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { GetHeroDto } from './dto/get-hero.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('heroes')
export class HerosController {
  constructor(private readonly herosService: HerosService) {}

  @ApiDoc({
    summary: 'Create Hero',
    description: 'Creates a new hero section entry. Requires proper permission.',
    response: HeroResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.HEROES_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createHeroDto: CreateHeroDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.herosService.create(req, createHeroDto, file);
  }

  @ApiDoc({
    summary: 'Get all Heroes',
    description: 'Retrieves all hero entries. Supports pagination and filters.',
    response: HeroResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetHeroDto) {
    return this.herosService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Hero',
    description: 'Retrieve a single hero entry by UUID.',
    response: HeroResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.herosService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Hero',
    description: 'Updates an existing hero entry. Requires proper permission.',
    response: HeroResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.HEROES_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHeroDto: UpdateHeroDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.herosService.update(id, updateHeroDto, file);
  }

  @ApiDoc({
    summary: 'Delete Hero',
    description: 'Soft deletes a hero entry. Requires proper permission.',
    response: HeroResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.HEROES_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.herosService.remove(id);
  }
}
