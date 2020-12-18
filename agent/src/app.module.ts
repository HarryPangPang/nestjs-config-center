import { Module } from '@nestjs/common';
import { ConfigsModule } from './config/config.module'

@Module({
  imports: [
    ConfigsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
