import { IChannel } from "./channel";
import { IUser } from "./user";

export interface IMessage {
    _id: string;
    text: string;
    createdAt: string;
    updatedAt: Date;
    user: IUser;
    channel: IChannel;
    }
  