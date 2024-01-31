import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Channel } from 'src/@types/channel';
import { User } from 'src/@types/user';
import { AuthService } from 'src/services/auth.service';
import { ChannelService } from 'src/services/channel.service';
import { UserService } from 'src/services/user.service';
import { ConnectedUserService } from 'src/services/connected-user.service';
import { ConnectedUser } from 'src/@types/connected-user';
import { JoinedChannelService } from 'src/services/joined-channel.service';
import { MessageService } from 'src/services/message.service';
import { Message } from 'src/@types/message';
import { JoinedChannel } from 'src/@types/joined-channel';

@WebSocketGateway({ cors: { origin: 'http://127.0.0.1:5173' } })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private authService: AuthService,
    private channelService: ChannelService,
    private userService: UserService,
    private connectedUserService: ConnectedUserService,
    private joinedChannelService: JoinedChannelService,
    private messageService: MessageService,
  ) {}
  @WebSocketServer()
  server: Server;
  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.joinedChannelService.deleteAll();
  }
  async handleConnection(socket: Socket) {
    try {
      console.log(socket.handshake.headers.authorization);
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const { id } = decodedToken;
      const user: User = await this.userService.getOne(id);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const channels = await this.channelService.getChannelsForUser(
          user._id.toString(),
        );
        return this.server.to(socket.id).emit('channels', channels);
      }
    } catch (e) {
      console.log(e);
      return this.disconnect(socket);
    }
  }
  async handleDisconnect(socket: Socket) {
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }
  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
  @SubscribeMessage('createRoom')
  async onCreateChannel(socket: Socket, channel: Channel) {
    //this.channelService.createChannel(channel, socket.data.user);
    const createdChannel: Channel = await this.channelService.createChannel(
      channel,
      socket.data.user,
    );

    for (const user of createdChannel.connectedUsers) {
      const connections: ConnectedUser[] =
        await this.connectedUserService.findByUser(user);
      const channels = await this.channelService.getChannelsForUser(user?._id);
      for (const connection of connections) {
        this.server.to(connection.socketId).emit('channels', channels);
      }
    }
  }

  @SubscribeMessage('joinRoom')
  async onJoinChannel(socket: Socket, channel: Channel) {
    const messages = await this.messageService.findMessagesForChannel(channel);
    await this.joinedChannelService.create({
      socketId: socket.id,
      user: socket.data.user,
      channel,
    });
    this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('joinDefaultChannel')
  async onjoinDefaultChannel(socket: Socket) {
    const defaultChannel = {
      name: 'Welcome channel',
      desc: 'Welcome to this channel',
    };
    this.server.to(socket.id).emit('defaultChannel', defaultChannel);
  }

  @SubscribeMessage('leaveChannel')
  async onLeaveRoom(socket: Socket) {
    await this.joinedChannelService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: Message) {
    const createdMessage = await this.messageService.create({
      ...message,
      user: socket.data.user,
      userId: socket.data.user._id,
    });
    const channel = await this.channelService.getChannel(
      createdMessage.channel.name,
    );
    const joinedUsers: JoinedChannel[] =
      await this.joinedChannelService.findByRoom(channel);
    for (const user of joinedUsers) {
      this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }
}
