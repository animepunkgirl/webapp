import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../schemas/user.schema";
import {BotModule} from "../bot/bot.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BotModule
  ],
  exports: [UserService, MongooseModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}