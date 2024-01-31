import { ObjectId } from 'bson';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.model';

@Schema()
export class ConnectedUser {
  _id?: ObjectId | string;

  @Prop()
  socketId: string;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  user: User;
}

export const ConnectedUserSchema = SchemaFactory.createForClass(ConnectedUser);
