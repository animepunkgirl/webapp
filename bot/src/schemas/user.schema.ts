import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  /* Chat ID with a user on Telegram */
  @Prop({ immutable: true })
  chat_id: number;

  /* User VK API access token */
  @Prop()
  access_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);