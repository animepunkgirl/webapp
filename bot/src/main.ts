import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from "./helpers/logger/logger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // bufferLogs: true
  });
  app.enableCors()
  // app.useLogger(new AppLogger())
  await app.listen(3001);
}
bootstrap().then();
