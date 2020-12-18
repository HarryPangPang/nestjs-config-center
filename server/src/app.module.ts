import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER ,APP_GUARD} from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ConfigModule as CModule} from './config/configs.module'
import { RedisModule } from './redis/redis.module'
import { AllWSExceptionsFilter } from './filter/BaseWsExceptionFilter';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './filter/AllExceptionsFilter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {CookieSessionModule} from 'nestjs-cookie-session';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [

  ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../client/build'),
      exclude: ['/api*'],
    }),
    CModule,
    RedisModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost/fe_config_center',{
      useCreateIndex: true
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV || 'development'}.env`,
      isGlobal: true,
    }),
    CookieSessionModule.forRoot({ session: { secret: 'YndasU8sa', name:'sess:config' } }),
  ],
  providers:[
    {
      provide: APP_FILTER,
      useClass: AllWSExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
