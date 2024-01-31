import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/@types/user';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDto>,
    private jwtService: JwtService,
  ) {}
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email: username });
    if (!user) {
      throw new BadRequestException('Invalid email or password!');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid password!');
    }
    return user;
  }
  async getUserIfTokenMatched(id: string) {
    const user = await this.userModel.findOne({
      _id: id,
    });
    if (user) return user;
  }
  async register(data: UserDto): Promise<UserDto> {
    const { email, password } = data;
    const hashPassword = await this.hashPassword(password);
    const user = await this.userModel.create({ email, password: hashPassword });
    return user;
  }
  async login(data: User): Promise<User | object> {
    // const { email, password } = data;
    // const user = await this.userModel.findOne({ email });
    // if (!user) {
    //   throw new UnauthorizedException('Invalid email or password!');
    // }
    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    // if (!isPasswordMatch) {
    //   throw new UnauthorizedException('Invalid password!');
    // }
    const plainData = instanceToPlain(data);
    delete plainData?._doc?.password;
    const access_token = await this.jwtService.signAsync({ id: data._id });
    const refresh_token = await this.jwtService.signAsync(
      { id: data._id },
      { expiresIn: '5d' },
    );
    if (refresh_token) {
      await this.userModel.updateOne(
        { _id: data._id },
        { refreshToken: refresh_token },
      );
    }
    const newData = plainData?._doc;
    newData._id = data._id;
    return {
      data: newData,
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }
  async logout(data: UserDto): Promise<string | object> {
    await this.userModel.updateOne({ _id: data._id }, { refreshToken: null });
    return { msg: 'Logout success!' };
  }
  async verifyJwt(token: string): Promise<any> {
    try {
      const decodedToken = await this.jwtService.verifyAsync(token);
      // Token verification successful
      return decodedToken;
    } catch (err) {
      // Token verification failed
      throw new Error('Invalid token');
    }
  }
  async refreshToken(data: UserDto): Promise<string | object> {
    console.log(data._id.toString());
    const refresh_token = data.refreshToken;
    const res = await this.userModel.findOne({
      refreshToken: refresh_token,
    });
    if (res) {
      const decoded = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_SECRET,
      });
      const access_token = await this.jwtService.signAsync({ id: res._id });
      return decoded.id === res._id.toString()
        ? { access_token: access_token }
        : {};
    }
  }
}
