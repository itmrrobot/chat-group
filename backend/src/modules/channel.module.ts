import { Module } from '@nestjs/common';
import { ChannelController } from 'src/controllers/channel.controller';
import { ChannelService } from 'src/services/channel.service';

@Module({
  providers: [ChannelService],
  exports: [ChannelService],
  controllers: [ChannelController],
})
export class ChannelModule {}
