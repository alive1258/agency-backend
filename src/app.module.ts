import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { DataQueryModule } from './common/data-query/data-query.module';
import { DatabaseExceptionFilter } from './common/errors/global.errors';
import { JwtOrApiKeyGuard } from './auth/guards/jwt-or-api-key.guard';
import { MailModule } from './modules/mail/mail.module';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { AccessTokenStrategy, RefreshTokenStrategy } from './auth/strategies';
import { CategoriesModule } from './modules/categories/categories.module';
import { ServicesModule } from './modules/services/services.module';
import { BusinessWeCoverModule } from './modules/business-we-cover/business-we-cover.module';
import { WhyChooseUsModule } from './modules/why-choose-us/why-choose-us.module';
import { PricingsModule } from './modules/pricings/pricings.module';
import { PricingCategoryModule } from './modules/pricing-category/pricing-category.module';
import { PricingFeaturesModule } from './modules/pricing-features/pricing-features.module';
import { FileUploadsModule } from './common/file-uploads/file-uploads.modules';
import { AssigenPricingFeaturesModule } from './modules/assigen-pricing-features/assigen-pricing-features.module';
import { HerosModule } from './modules/heros/heros.module';
import { PartnersModule } from './modules/partners/partners.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { TrustUsModule } from './modules/trust-us/trust-us.module';
import { UpzelasModule } from './modules/system-table/upzelas/upzelas.module';
import { DivisionModule } from './modules/system-table/divisions/divisions.modules';
import { DistrictModule } from './modules/system-table/districts/districts.modules';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PaymentsModule } from './modules/payments/payments/payments.module';
import { ServiceVideosModule } from './modules/service-videos/service-videos.module';
import { ServiceReviewsModule } from './modules/service-reviews/service-reviews.module';
import { OurWorkProcessModule } from './modules/our-work-process/our-work-process.module';
import { QuestionAnswersModule } from './modules/question-answers/question-answers.module';
import { TeamsModule } from './modules/teams/teams.module';
import { WhoWeAreModule } from './modules/who-we-are/who-we-are.module';
import { WhoWeAreFeaturesModule } from './modules/who-we-are-features/who-we-are-features.module';
import { BlogCategoriesModule } from './modules/blog-categories/blog-categories.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { BlogDetailsModule } from './modules/blog-details/blog-details.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60, // 60 seconds
        limit: 20,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV ? `.env.${ENV}` : '.env',
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),

    // Database connection with async configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
        synchronize: configService.get<boolean>('database.synchronize'),
        // ssl: configService.get('database.ssl'),
        ssl:
          process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),

    // JWT configure
    JwtModule.register({}),

    // Cron / Scheduler
    ScheduleModule.forRoot(),
    UsersModule,
    DataQueryModule,
    MailModule,
    FileUploadsModule,
    CategoriesModule,
    ServicesModule,
    BusinessWeCoverModule,
    WhyChooseUsModule,
    PricingsModule,
    PricingCategoryModule,
    PricingFeaturesModule,
    AssigenPricingFeaturesModule,
    HerosModule,
    PartnersModule,
    TestimonialsModule,
    TrustUsModule,
    UpzelasModule,
    DivisionModule,
    DistrictModule,
    SubscriptionsModule,
    PaymentsModule,

    ServiceVideosModule,
    ServiceReviewsModule,
    OurWorkProcessModule,
    QuestionAnswersModule,
    TeamsModule,
    WhoWeAreModule,
    WhoWeAreFeaturesModule,
    BlogCategoriesModule,
    BlogsModule,
    BlogDetailsModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    JwtOrApiKeyGuard,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    // Global Throttler Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global Response Serialization
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    // Global Error Filter
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter, // Custom database exception handling
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // strip unknown properties
        forbidNonWhitelisted: true, // throw error on unknown properties
        transform: true, // auto-transform payloads to DTO classes
        transformOptions: { enableImplicitConversion: true }, // auto convert primitives
      }),
    },
  ],
  exports: [JwtOrApiKeyGuard],
})
export class AppModule {}
