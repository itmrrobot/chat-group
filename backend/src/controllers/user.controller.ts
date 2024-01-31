import {
  Controller,
  Get,
  HttpException,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UserService } from 'src/services/user.service';
import { Response } from 'express';
import { User } from 'src/@types/user';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Put('update')
  async update(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto | HttpException> {
    try {
      console.log(req);
      const res = this.userService.updateUser(req.user, req.body);
      return res;
    } catch {
      res.status(400).send();
    }
  }

  @UseGuards(JwtGuard)
  @Get('find-by-username')
  async findAllByUsername(
    @Query('username') username: string,
  ): Promise<User[]> {
    return await this.userService.findAllByUsername(username);
  }
}
