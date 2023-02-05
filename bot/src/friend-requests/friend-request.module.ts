import {Module} from "@nestjs/common";
import {FriendRequestService} from "./friend-request.service";
import {MongooseModule} from "@nestjs/mongoose";
import {FriendRequest, FriendRequestSchema} from "../schemas/friend-request.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FriendRequest.name, schema: FriendRequestSchema }]),
  ],
  providers: [FriendRequestService],
  exports: [FriendRequestService]
})
export class FriendRequestModule {}