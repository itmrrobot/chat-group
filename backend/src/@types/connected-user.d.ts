import { User } from './user';

export interface ConnectedUser {
  _id?: ObjectId | string;
  socketId: string;
  user: User;
}
