import { Channel } from './channel';
import { User } from './user';

export interface JoinedChannel {
  id?: number;
  socketId: string;
  user: User;
  channel: Channel;
}
