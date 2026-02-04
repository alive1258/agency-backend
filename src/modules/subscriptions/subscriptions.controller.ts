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
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { GetSubscriptionDto } from './dto/get-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  /**
   * Create Subscription
   */
  @ApiDoc({
    summary: 'Create Subscription',
    description: 'Creates a new subscription record. Requires proper permission.',
    status: HttpStatus.OK,
  })
  @Post()
  create(@Req() req: Request, @Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(req, createSubscriptionDto);
  }

  /**
   * Get all Subscriptions
   */
  @ApiDoc({
    summary: 'Get all Subscriptions',
    description: 'Retrieves all subscription records. Supports pagination and filters.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.SUBSCRIPTION_READ)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get()
  findAll(@Query() query: GetSubscriptionDto) {
    return this.subscriptionsService.findAll(query);
  }

  /**
   * Get my services
   */
  @ApiDoc({
    summary: 'Get my services',
    description: 'Retrieve a single subscription record by ID.',
    status: HttpStatus.OK,
  })
  // @RequirePermissions(Permission.SUBSCRIPTION_READ)
  @UseGuards(JwtOrApiKeyGuard)
  @Get('my-service')
  myServices(@Req() req: Request) {
    return this.subscriptionsService.findMyService(req);
  }

  /**
   * Get single Subscription
   */
  @ApiDoc({
    summary: 'Get single Subscription',
    description: 'Retrieve a single subscription record by ID.',
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.findOne(id);
  }


  /**
   * Update Subscription
   */
  @ApiDoc({
    summary: 'Update Subscription',
    description: 'Updates an existing subscription record. Requires proper permission.',
    status: HttpStatus.OK,
  })
  // @RequirePermissions(Permission.SUBSCRIPTIONS_UPDATE)
  // @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  // @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  /**
   * Delete Subscription
   */
  @ApiDoc({
    summary: 'Delete Subscription',
    description: 'Soft deletes a subscription record. Requires proper permission.',
    status: HttpStatus.OK,
  })
  // @RequirePermissions(Permission.SUBSCRIPTIONS_DELETE)
  // @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  // @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.remove(id);
  }
}