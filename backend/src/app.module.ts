import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { ChatModule } from './modules/chat.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`${process.env.MONGO_URL}`),
    AuthModule,
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/register', method: RequestMethod.POST },
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/logout', method: RequestMethod.POST },
        { path: '/user/find-by-username', method: RequestMethod.GET },
        { path: '/auth/refresh', method: RequestMethod.POST },
        { path: '/channels/find-by-channelName', method: RequestMethod.GET },
        { path: '/user/update', method: RequestMethod.PUT },
      )
      .forRoutes('');
  }
}
