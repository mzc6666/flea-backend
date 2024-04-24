import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '../auth/index.provider';
import { Response } from 'express';
import { SecondComment, TopComment } from 'src/db/modules/comment';
import {
  I_CommentToGood,
  I_GetComment,
  I_ReplyComment,
  I_DeleteComment,
} from './type';
import { User } from 'src/db/modules/user';
import { CommonResBody } from 'src/handler/response';
import { Good } from 'src/db/modules/goods/model';
import mongoose from 'mongoose';

@Controller('/comments')
export class CommentController {
  constructor(private authService: AuthService) {}

  // 获取物品的评论
  // TODO replies中的user信息没找出来 & replies没找全
  @Get()
  async getCommentOfGood(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const query = (req as any).query as I_GetComment.Query;
      const { id, pageSize, lastValue } = query;

      const commentCountGroup = await TopComment.aggregate([
        {
          $match: {
            good: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'secondcomments',
            localField: '_id',
            foreignField: 'comment',
            as: 'replies',
          },
        },
        {
          $project: {
            _id: 1,
            replyCount: { $size: '$replies' },
          },
        },
        {
          $group: {
            _id: null,
            totalComments: { $sum: 1 },
            totalReplies: { $sum: '$replyCount' },
          },
        },
        {
          $project: {
            _id: 0,
            totalComments: 1,
            totalReplies: 1,
          },
        },
      ]);

      const totalCount =
        commentCountGroup.length > 0
          ? commentCountGroup[0].totalComments +
            commentCountGroup[0].totalReplies
          : 0;
      const queryParam = Object.assign(
        { good: new mongoose.Types.ObjectId(id) },
        lastValue
          ? { _id: { $lt: new mongoose.Types.ObjectId(lastValue) } }
          : {},
      );
      const comments = await TopComment.aggregate([
        { $match: queryParam },
        { $sort: { _id: -1 } },
        { $limit: Number(pageSize) },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $addFields: {
            user: { $arrayElemAt: ['$user', 0] },
          },
        },
        {
          $lookup: {
            from: 'secondcomments', // 关联的集合
            localField: '_id', // 本地字段
            foreignField: 'comment', // 外部字段
            as: 'replies', // 结果中的字段名
          },
        },
        {
          $addFields: {
            replies: { $slice: ['$replies', 1] }, // 仅返回一条回复
          },
        },
      ]);

      const jsonData = {
        totalCount,
        lists: comments,
        pageSize: Number(pageSize),
        hasMore: comments.length === Number(pageSize),
        lastValue: comments.at(-1)?._id ?? lastValue,
      };
      res.json(new CommonResBody('200', 'success', jsonData));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).end();
    }
  }

  // 给物品添加顶级评论
  // OK
  @Post('topComment')
  async commentToGood(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.headers['token'] as string;
    const body = req.body as any as I_CommentToGood.Body;
    const openId = this.authService.token2OpenId(token);
    const user_id = (await User.findOne({ openId }))._id;
    const topComment = new TopComment({
      user: user_id,
      good: body.goodId,
      content: body.content,
      comment_time: Date.now(),
    });
    await topComment.save();
    const data = await TopComment.aggregate([
      {
        $match: {
          _id: topComment._id,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$user', 0] },
          replies: [],
        },
      },
    ]);
    res.json(new CommonResBody('200', 'success', data[0]));
    try {
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).end();
    }
  }

  // 回复评论
  // OK
  @Post('reply')
  async replyComment(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = req.headers['token'] as string;
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      const body = req.body as any as I_ReplyComment.Body;
      const reply = new SecondComment({
        user: user_id,
        comment: body.id,
        content: body.content,
        comment_time: Date.now(),
      });
      await reply.save();
      const data = await SecondComment.findById(reply._id).populate('user');
      res.json(new CommonResBody('200', 'success', data));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).end();
    }
  }

  // 删除评论
  // OK
  @Post('delete')
  async deleteComment(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = req.headers['token'] as string;
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      const body = req.body as any as I_DeleteComment.Body;
      const comment = await TopComment.findOne({
        _id: body.id,
        user: user_id,
      });
      if (!comment) {
        res.json(new CommonResBody('200', 'success', 'not match'));
      }
      await SecondComment.deleteMany({
        comment: comment._id,
      });
      await TopComment.findByIdAndDelete(comment._id);
      res.json(new CommonResBody('200', 'success', null));
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).end();
    }
  }

  // 删除回复
  // OK
  @Post('delete-reply')
  async deleteReply(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = req.headers['token'] as string;
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      const body = req.body as any as I_DeleteComment.Body;
      const result = await SecondComment.deleteMany({
        _id: body.id,
        user: user_id,
      });
      res.json(new CommonResBody('200', 'success', null));
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).end();
    }
  }
}
