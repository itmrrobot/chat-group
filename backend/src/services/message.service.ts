import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/models/message.model';
import { Message as MessageI } from 'src/@types/message';
import { Channel } from 'src/@types/channel';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message')
    private messageModel: Model<Message>,
  ) {}
  async create(message: MessageI): Promise<Message> {
    return await this.messageModel.create(message);
  }
  async findMessagesForChannel(channel: Channel): Promise<Message[]> {
    const data = await this.messageModel.find({
      'channel.name': channel?.name,
    });
    return data;
  }
}
