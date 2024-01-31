import { Channel } from './channel';
import { User } from './user';

export interface Message {
  _id: ObjectId | string;
  text: string;
  created_at: Date;
  user: User;
  userId: string;
  channel: Channel;
}
