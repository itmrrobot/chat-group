import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { instanceToPlain } from 'class-transformer';
import { Model } from 'mongoose';
import { Channel } from 'src/@types/channel';
import { User } from 'src/@types/user';
import { Channel as ChannelModel } from 'src/models/channel.model';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel('Channel') private channelModel: Model<ChannelModel>,
  ) {}
  async createChannel(channel: Channel, creator: User): Promise<ChannelModel> {
    const newChannel = await this.addCreatorToChannel(channel, creator);
    return await this.channelModel.create(newChannel);
  }

  async getChannel(channelName: string): Promise<Channel> {
    return await this.channelModel.findOne({ name: channelName });
  }

  async findAllByChannelName(
    channelName: string,
    user: User,
  ): Promise<Channel[]> {
    console.log('Test', user, await this.channelModel.find({}));
    return await this.channelModel.find({
      connectedUsers: {
        $elemMatch: { id: user._id },
      },
      name: { $regex: new RegExp(channelName, 'i') },
    });
  }

  async getChannelsForUser(userId: string): Promise<Channel> {
    const channels = await this.channelModel.find({
      connectedUsers: {
        $elemMatch: { id: userId },
      },
    });
    const plainData = instanceToPlain(channels);
    const channelsForUser = plainData?.map((p) => p._doc);
    return channelsForUser;
  }

  async addCreatorToChannel(channel: Channel, creator: User): Promise<Channel> {
    console.log(channel);
    channel.connectedUsers.push(creator);
    return channel;
  }
}
