import { Module, forwardRef } from '@nestjs/common';
import { ChatGateway } from 'src/gateway/chat.gateway';
import { ChannelService } from 'src/services/channel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelSchema } from 'src/models/channel.model';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { ConnectedUserSchema } from 'src/models/connected-user.model';
import { ConnectedUserService } from 'src/services/connected-user.service';
import { MessageSchema } from 'src/models/message.model';
import { JoinedChannelSchema } from 'src/models/joined-channel.model';
import { JoinedChannelService } from 'src/services/joined-channel.service';
import { MessageService } from 'src/services/message.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Channel', schema: ChannelSchema },
      { name: 'ConnectedUser', schema: ConnectedUserSchema },
      { name: 'Message', schema: MessageSchema },
      { name: 'JoinedChannel', schema: JoinedChannelSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  providers: [
    ChatGateway,
    ChannelService,
    ConnectedUserService,
    JoinedChannelService,
    MessageService,
  ],
})
export class ChatModule {}
