import {Module} from "@nestjs/common";
import {FriendRequestService} from "./friend-request.service";
import {MongooseModule} from "@nestjs/mongoose";
import {FriendRequest, FriendRequestSchema} from "../schemas/friend-request.schema";
import {UserModule} from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FriendRequest.name, schema: FriendRequestSchema }]),
    UserModule
  ],
  providers: [FriendRequestService],
  exports: [FriendRequestService]
})
export class FriendRequestModule {}