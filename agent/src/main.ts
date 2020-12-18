import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {IoClientAdapter} from './adapters/ioclient.adapter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoClientAdapter(app))
  app.setGlobalPrefix('api');
  await app.listen(65512);
}
bootstrap();
