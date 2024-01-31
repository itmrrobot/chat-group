import { Message } from './message.model';
import { User } from './user.model';
import { ObjectId } from 'bson';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { JoinedChannel } from './joined-channel.model';

@Schema()
export class Channel {
  _id: ObjectId | string;

  @Prop()
  name: string;

  @Prop()
  desc: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Message[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  connectedUsers: User[];

  @Prop({ type: Types.ObjectId, ref: 'JoinedChannel' })
  joinedUsers: JoinedChannel;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
