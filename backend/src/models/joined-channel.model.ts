import { User } from './user.model';
import { ObjectId } from 'bson';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Channel } from './channel.model';

@Schema()
export class JoinedChannel {
  _id: ObjectId | string;

  @Prop()
  socketId: string;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  user: User;

  @Prop({ ref: 'Channel', type: Types.ObjectId })
  channel: Channel;
}

export const JoinedChannelSchema = SchemaFactory.createForClass(JoinedChannel);
