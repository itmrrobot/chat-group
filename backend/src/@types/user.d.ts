export interface User {
  _id: ObjectId | string;
  email: string;
  name: string;
  bio: string;
  phone: number;
  avatar: string;
  clientId: string;
}
