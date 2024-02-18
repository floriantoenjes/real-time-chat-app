import { Injectable } from '@nestjs/common';
import { User } from '../../shared/user.contract';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
  ) {}

  async findUserBy(filter: any) {
    const password = filter.password;
    delete filter.password;

    let user = await this.userModel.findOne(filter);
    if (
      user &&
      password !== undefined &&
      !(await bcrypt.compare(password, user.password))
    ) {
      user = null;
    }

    return this.returnUserOrNotFound(user);
  }

  async createUser(email: string, password: string, username: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const createdUser = await this.userModel.create({
      email,
      password: hash,
      username,
    });

    if (!createdUser) {
      return { status: 400 as const, body: null };
    }

    return { status: 201 as const, body: createdUser };
  }

  private returnUserOrNotFound(user: User | null) {
    if (!user) {
      return {
        status: 404 as const,
        body: null,
      };
    }

    return {
      status: 200 as const,
      body: user,
    };
  }
}
