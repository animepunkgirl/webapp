import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument, Types} from "mongoose";
import {User, UserDocument} from "./user.schema";

export type FriendRequestDocument = HydratedDocument<FriendRequest>

@Schema({ timestamps: true })
export class FriendRequest {
  /* Friend request sender */
  @Prop({ required: true, immutable: true, type: Types.ObjectId, ref: User.name })
  from: UserDocument

  /* Friend request recipient */
  @Prop({ required: true, immutable: true, type: Types.ObjectId, ref: User.name })
  to: UserDocument

  @Prop()
  createdAt: Date
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest)