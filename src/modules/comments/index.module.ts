import { Module } from '@nestjs/common';
import { CommentController } from './index.controller';

@Module({
  controllers: [CommentController],
})
export class CommentModule {}
