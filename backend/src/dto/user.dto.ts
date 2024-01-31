import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UserDto {
  @Expose()
  _id: ObjectId | string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
    message:
      'password should contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @Expose()
  name: string;

  @Expose()
  bio: string;

  @Expose()
  phone: number;

  @Expose()
  avatar: string;

  refreshToken: string;

  @Expose()
  clientId: string;
}
