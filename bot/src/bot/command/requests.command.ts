import {Injectable} from "@nestjs/common";
import {Command} from "./command";
import {MetaMessage} from "../bot.types";

// TODO: Show list of incoming friend requests
@Injectable()
export class RequestsCommand extends Command {
  name ='/requests'

  async handle(msg: MetaMessage): Promise<void> {
    return Promise.resolve(undefined);
  }
}