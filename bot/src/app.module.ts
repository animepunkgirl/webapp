import {Module, CacheModule, CacheStore} from '@nestjs/common';
import {FeedModule} from "./feed/feed.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {BotModule} from "./bot/bot.module";
import {MongooseModule} from "@nestjs/mongoose";
import {redisStore} from 'cache-manager-redis-store';
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
          uri: configService.get<string>("MONGODB_URI")
      }),
      inject: [ConfigService]
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: 1000,
        store: (await redisStore({
          url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
          username: configService.get('REDIS_USER'),
          password: configService.get('REDIS_PASSWORD')
        })) as unknown as CacheStore,
      }),
      inject: [ConfigService],
    }),
    BotBootstrapModule,
    CoreModule,
    FeedModule,
    BotModule,
    UserModule,
  ]
})
export class AppModule {}
