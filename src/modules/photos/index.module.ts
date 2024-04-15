import { Module } from '@nestjs/common';
import { PhotoController } from './index.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './images', // 设置上传文件的目录
    }),
  ],
  controllers: [PhotoController],
})
export class PhotoModule {}
