import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigGateway } from './config.gateway'

@Module({
  controllers: [ConfigController],
  providers: [ConfigGateway]
})
export class ConfigsModule {}
