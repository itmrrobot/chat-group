import { IUser } from "./user";


  export interface IChannel {
    _id: string;
    name: string;
    desc: string;
    messages?: [];
    connectedUsers: [] | IUser[];
  }
  