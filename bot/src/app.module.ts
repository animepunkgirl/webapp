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
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get<string>("MONGODB_URI"))
        return {
          uri: configService.get<string>("MONGODB_URI"),
        }
      },
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
