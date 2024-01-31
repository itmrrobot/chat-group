import {
  Controller,
  Request,
  Get,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Channel } from 'src/@types/channel';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ChannelService } from 'src/services/channel.service';

@Controller('channels')
export class ChannelController {
  constructor(private channelService: ChannelService) {}
  @UseGuards(JwtGuard)
  @Get('find-by-channelName')
  async findAllByChannelName(
    @Query('channelName') channelName: string,
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ): Promise<Channel[]> {
    console.log(req.user);
    try {
      return await this.channelService.findAllByChannelName(
        channelName,
        req.user,
      );
    } catch (e) {
      console.log(e);
    }
  }
}
