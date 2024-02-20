import {
  Body,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  NestRequestShapes,
  TsRest,
  TsRestHandler,
  tsRestHandler,
  TsRestRequest,
} from '@ts-rest/nest';
import { userContract } from '../../shared/user.contract';
import { UserService } from '../services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectStorageService } from '../services/object-storage.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly objectStorageService: ObjectStorageService,
  ) {}

  @TsRestHandler(userContract.signIn)
  async signIn() {
    return tsRestHandler(userContract.signIn, async ({ body }) => {
      return this.userService.findUserBy({
        email: body.email,
        password: body.password,
      });
    });
  }

  @TsRestHandler(userContract.signUp)
  async signUp() {
    return tsRestHandler(userContract.signUp, async ({ body }) => {
      return this.userService.createUser(
        body.email,
        body.password,
        body.username,
      );
    });
  }

  @TsRestHandler(userContract.searchUserByUsername)
  async searchUserByUsername() {
    return tsRestHandler(
      userContract.searchUserByUsername,
      async ({ body }) => {
        return this.userService.findUserBy({ username: body.username });
      },
    );
  }

  @TsRestHandler(userContract.loadAvatar)
  async loadAvatar() {
    return tsRestHandler(userContract.loadAvatar, async ({ params }) => {
      const objectDataString = await this.objectStorageService.loadFile(
        params.userId + '_avatar',
      );

      if (objectDataString) {
        return {
          status: 200,
          body: objectDataString,
        };
      }

      return {
        status: 404,
        body: false,
      };
    });
  }

  @TsRest(userContract.uploadAvatar)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserAvatar(
    @TsRestRequest()
    {}: NestRequestShapes<typeof userContract>['uploadAvatar'],
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: { userId: string },
  ) {
    await this.objectStorageService.uploadFile(
      avatar.buffer,
      body.userId.replaceAll('"', '') + '_avatar',
    );

    return {
      status: 200 as const,
      body: true,
    };
  }
}
