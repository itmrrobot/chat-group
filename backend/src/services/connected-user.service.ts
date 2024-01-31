import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConnectedUser as ConnectedUserI } from 'src/@types/connected-user';
import { User } from 'src/@types/user';
import { ConnectedUser } from 'src/models/connected-user.model';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectModel('ConnectedUser')
    private connectedUserModel: Model<ConnectedUser>,
  ) {}

  async create(connectedUser: ConnectedUserI): Promise<ConnectedUser> {
    return await this.connectedUserModel.create(connectedUser);
  }

  async findByUser(user: User): Promise<ConnectedUserI[]> {
    console.log(user);
    return await this.connectedUserModel.find({ user });
  }

  async deleteBySocketId(socketId: string) {
    return await this.connectedUserModel.deleteOne({ socketId });
  }
  async deleteAll() {
    await this.connectedUserModel.deleteMany({});
  }
}
