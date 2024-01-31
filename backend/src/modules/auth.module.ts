import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from 'src/controllers/auth.controller';
import { JwtGuard } from 'src/guards/jwt.guard';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { UserSchema } from 'src/models/user.model';
import { AuthService } from 'src/services/auth.service';
import { JwtStrategy } from 'src/strategys/jwt.strategy';
import { LocalStrategy } from 'src/strategys/local.strategy';
import { RefreshJWTStrategy } from 'src/strategys/refreshToken.strategy';
import { ChatModule } from './chat.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: `${process.env.JWT_SECRET}`,
        signOptions: { expiresIn: '3d' },
      }),
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => ChatModule),
  ],
  providers: [
    AuthService,
    JwtGuard,
    JwtStrategy,
    RefreshJWTStrategy,
    LocalStrategy,
    LocalAuthGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
