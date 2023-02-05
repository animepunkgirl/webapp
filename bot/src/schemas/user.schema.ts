import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument, Types} from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  /* Chat ID with a user on Telegram */
  @Prop({ immutable: true, required: true, unique: true })
  chat_id: number;

  /* User VK API access token */
  @Prop()
  access_token: string;

  /* Telegram username of user !can be outdated! */
  @Prop()
  username?: string;

  /* User friend list */
  @Prop({type: [Types.ObjectId], ref: User.name})
  friends: User[]
}

export const UserSchema = SchemaFactory.createForClass(User);