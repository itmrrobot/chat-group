import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/@types/user';
import { UserDto } from 'src/dto/user.dto';
import { hashPassword } from 'src/utils/util';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDto>) {}
  async getUser(data: UserDto): Promise<UserDto | HttpException> {
    const { _id } = data;
    const user = await this.userModel.findOne({ _id });
    if (!user) return new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    return user;
  }
  async findAllByUsername(username: string): Promise<User[]> {
    return await this.userModel.find({
      name: { $regex: new RegExp(username, 'i') },
    });
  }
  async updateUser(
    data: UserDto,
    body: UserDto,
  ): Promise<UserDto | HttpException> {
    const { _id } = data;
    const { name, bio, phone } = body;
    let password;
    if (body?.password) {
      password = await hashPassword(password);
    }
    // console.log(name);
    const user = await this.userModel.findOne({ _id });
    if (!user) return new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    await this.userModel.updateOne({ _id }, { name, bio, phone, password });
    return await this.userModel.findOne({ _id });
  }
  getOne(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id });
  }
}
