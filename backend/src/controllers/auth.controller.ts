import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { Response } from 'express';
import { UserDto } from 'src/dto/user.dto';
import { RefreshJwtGuard } from 'src/guards/refresh-jwt.guard';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { User } from 'src/@types/user';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() data: UserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    try {
      const user = await this.authService.register(data);
      return user;
    } catch (e) {
      res.status(500).send(new InternalServerErrorException());
      console.log(e);
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User | object> {
    try {
      delete req.user.password;
      console.log(req.user.password);
      const user = await this.authService.login(req.user);
      // const plainData = instanceToPlain(user);
      // console.log(plainData?.data?._doc);
      // delete plainData?.data?._doc?.password;
      return user;
    } catch (e) {
      res.status(500).send(new InternalServerErrorException());
      console.log(e);
    }
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string | object> {
    try {
      const user = await this.authService.logout(req.user);
      console.log(req.user);
      return user;
    } catch (e) {
      res.status(500).send(new InternalServerErrorException());
      console.log(e);
    }
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string | object> {
    try {
      const user = await this.authService.refreshToken(req.user);
      console.log(req.user);
      return user;
    } catch (e) {
      res.status(401).send(new UnauthorizedException());
    }
  }
}
