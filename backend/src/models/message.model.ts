import { User } from './user.model';
import { Channel } from './channel.model';
import { ObjectId } from 'bson';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Message {
  _id: ObjectId | string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop()
  user: User;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  userId: User;

  @Prop({ required: true, ref: 'Channel', type: Types.ObjectId })
  channel: Channel;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
