import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigsService } from './configs.service';
import { ConfigController } from './configs.controller';
import { Config, ConfigSchema} from './schemas/config.schema'
import { ConfigGateway } from './configs.gateway'

@Module({
  imports: [MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }])],
  controllers: [ConfigController],
  providers: [ConfigsService,ConfigGateway]
})
export class ConfigModule {}
