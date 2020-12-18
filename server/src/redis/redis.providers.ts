import { Provider } from '@nestjs/common';
import IORedis, { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

import { REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT } from './redis.constants';

export const redisProviders: Provider[] = [
  {
    useFactory: (configService:ConfigService): Redis => {
      return new IORedis({
        host: configService.get('REDIS_HOST'),
        port: parseInt(configService.get('REDIS_PORT'),10),
        password: configService.get('REDIS_PASSWORD'),
      });
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
    inject: [ConfigService]
  },
  {
    useFactory: (configService:ConfigService): Redis => {
      return new IORedis({
        host: configService.get('REDIS_HOST'),
        port: parseInt(configService.get('REDIS_PORT'),10),
        password: configService.get('REDIS_PASSWORD'),
      });
    },
    provide: REDIS_PUBLISHER_CLIENT,
    inject: [ConfigService]
  },
];
