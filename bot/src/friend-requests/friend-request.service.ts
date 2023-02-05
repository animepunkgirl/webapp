import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {FriendRequest, FriendRequestDocument} from "../schemas/friend-request.schema";
import {User, UserDocument} from "../schemas/user.schema";

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequestDocument>,
  ) {}

  // TODO: Check if friend request already created and users are not friends already
  async create(from: UserDocument["_id"], to: UserDocument["_id"]): Promise<FriendRequestDocument> {
    const friendRequest = new this.friendRequestModel({
      from,
      to
    })
    return await friendRequest.save();
  }

  async accept(id: string) {
    const friendRequest = await this.friendRequestModel
      .findById(id)
      .populate('from')
      .populate('to')
      .exec()
    if(!friendRequest)
      return;

    const from = friendRequest.from;
    const to = friendRequest.to;
    from.friends.push(to)
    to.friends.push(from)
    await to.save();
    await from.save();
    await friendRequest.remove();
  }

  async decline(id: string) {
    return this.friendRequestModel.findByIdAndDelete(id)
  }
}