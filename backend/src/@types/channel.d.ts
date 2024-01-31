export interface Channel {
  _id: ObjectId | string;
  name: string;
  desc: string;
  messages: Message[];
  connectedUsers: User[];
}
