import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from "./helpers/logger/logger.service";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  app.enableCors()
  const logger = new AppLogger()
  app.useLogger(logger)
  const config = app.get<ConfigService>(ConfigService)
  const port = config.get('PORT')
  await app.listen(port);
  logger.log(`Started on :${port}`)
}
bootstrap().then();
