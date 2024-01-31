import { Injectable } from '@nestjs/common';
import { Channel } from 'src/@types/channel';
import { User } from 'src/@types/user';
import { JoinedChannel } from 'src/models/joined-channel.model';
import { JoinedChannel as JoinedChannelI } from 'src/@types/joined-channel';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JoinedChannelService {
  constructor(
    @InjectModel('JoinedChannel')
    private joinedChannelModel: Model<JoinedChannel>,
  ) {}
  async create(joinedRoom: JoinedChannelI): Promise<JoinedChannel> {
    return await this.joinedChannelModel.create(joinedRoom);
  }

  async findByUser(user: User): Promise<JoinedChannelI[]> {
    return await this.joinedChannelModel.find({ user });
  }

  async findByRoom(channel: Channel): Promise<JoinedChannelI[]> {
    return await this.joinedChannelModel.find({
      'channel.name': channel.name,
    });
  }

  async deleteBySocketId(socketId: string) {
    return await this.joinedChannelModel.deleteOne({ socketId });
  }
  async deleteAll() {
    await this.joinedChannelModel.deleteMany({});
  }
}
