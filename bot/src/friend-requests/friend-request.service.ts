import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {FriendRequest, FriendRequestDocument} from "../schemas/friend-request.schema";
import {User, UserDocument} from "../schemas/user.schema";
import {UserService} from "../user/user.service";

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequestDocument>,
    private userService: UserService
  ) {}

  // TODO: Catch errors
  async create(from: UserDocument["_id"], to: UserDocument["_id"]): Promise<FriendRequestDocument> {
    const existedFriendRequest = await this.friendRequestModel.findOne({
      from, to
    }).exec()
    if(existedFriendRequest)
      throw new Error('Friend request already exists')

    const isUserAreFriends = await this.userService.isUserAreFriends(from, to);
    if(isUserAreFriends)
      throw new Error('Users are friends already')

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

  async getIncomingRequests(userId: User["chat_id"]) {
    const user = await this.userService.getUserByChatId(userId)
    return await this.friendRequestModel.find({
      to: user._id
    }).exec()
  }
}