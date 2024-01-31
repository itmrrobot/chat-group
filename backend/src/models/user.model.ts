import { ObjectId } from 'bson';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  _id?: ObjectId | string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  bio: string;

  @Prop({ default: null })
  phone: number;

  @Prop({ default: null })
  avatar: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: null })
  clientId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
