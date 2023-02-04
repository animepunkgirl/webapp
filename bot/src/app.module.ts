import { Module } from '@nestjs/common';
import {FeedModule} from "./feed/feed.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {BotModule} from "./bot/bot.module";
import {MongooseModule} from "@nestjs/mongoose";
import {UserModule} from "./user/user.module";
import {CoreModule} from "./core.module";
import {BotBootstrapModule} from "./bot/bootstrap/bootstrap.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        dbName: configService.get<string>("MONDODB_NAME")
      }),
      inject: [ConfigService]
    }),
    BotBootstrapModule,
    CoreModule,
    FeedModule,
    BotModule,
    UserModule,
  ]
})
export class AppModule {}
