import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import userApi from 'src/request/user';
import { AuthService } from '../auth/index.provider';
import { GoodData, GoodParams } from './index.dto';
import { Good } from 'src/db/modules/goods/model';
import { Request, Response } from 'express';
import { CommonResBody } from 'src/handler/response';
import { Collect } from 'src/db/modules/collect';
import { Preview } from 'src/db/modules/preview';
import { User } from 'src/db/modules/user';
import { I_Preview } from './types';
import mongoose from 'mongoose';

@Controller('/goods')
export class GoodsController {
  constructor(private authService: AuthService) {}

  // 发布
  @Post('publish')
  async addGood(@Req() request: Request, @Res() response: Response) {
    try {
      const token = request.headers['token'] as string;
      const openId = this.authService.token2OpenId(token);
      const _id = (await User.findOne({ openId }))._id;
      const good = new Good(request.body);
      good.set('author', _id);
      await good.save();
      response.json(new CommonResBody('200', 'add success'));
    } catch (error) {
      console.log('error', error);
      response.status(500).end();
    }
  }

  // 获取列表
  @Get()
  async getList(@Res() response: Response, @Query() query: GoodParams) {
    try {
      const { lastValue, pageSize = 5, keywords = '' } = query;
      const lastTimeStamp = lastValue ? lastValue : Date.now();
      const regex = new RegExp(keywords, 'i');
      const lists = await Good.find({
        on_sale: true,
        desc: { $regex: regex },
        update_time: { $lt: lastTimeStamp },
      }).limit(pageSize);
      response.json(
        new CommonResBody('200', 'search success', {
          lists,
          lastValue: lists.at(-1)?.update_time ?? lastValue,
        }),
      );
    } catch (error) {
      console.log('error', error);
    }
  }

  // 获取单个信息
  @Get(':id')
  async getGoodById(
    @Param() param: { id: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('param', param);
    const token = req.headers['token'] as string;
    const openId = this.authService.token2OpenId(token!);
    const data = await Good.findOne({
      _id: new mongoose.Types.ObjectId(param.id),
    }).populate('author');
    console.log('data', data);
    if (!data) {
      res.status(HttpStatus.BAD_REQUEST).send();
      return;
    }
    const user_id = (await User.findOne({ openId }))._id;
    const collectCount =
      (await Collect.countDocuments({ good: param.id })) || 0;
    const isCollect = !!(await Collect.findOne({
      user: user_id,
      good: param.id,
    }));
    const resBody = {
      ...data.toObject(),
      collectCount,
      isCollect,
    };
    return new CommonResBody('200', 'success', !data ? null : resBody);
  }

  /* 删除物品 */
  @Post('delete')
  async goodDelete(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    try {
      const goodId = req.body.id as string;
      await Good.findByIdAndDelete(goodId);
      res.json(new CommonResBody('200', 'success', null));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(null);
    }
  }

  // 物品收藏
  @Post('collect')
  async collect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = req.headers['token'] as string;
      const goodId = req.body.id as any;
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      const result = await Collect.findOne({ user: user_id, good: goodId });
      if (result) {
        // 取消收藏
        await Collect.deleteOne({
          user: user_id,
          good: goodId,
        });
        res.json(new CommonResBody('200', 'success', null));
      } else {
        // 收藏
        const collection = new Collect({
          user: user_id,
          good: goodId,
        });
        await collection.save();
        res.json(new CommonResBody('200', 'success', 'collect success'));
      }
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(null);
    }
  }

  // 物品浏览
  @Post('preview')
  async preview(
    @Headers() headers,
    @Body() body: I_Preview.Body,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = headers['token'] as string;
      const goodId = body.id;
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      const datas = await Preview.find({ good: body.id, user: user_id });
      if (datas.length) {
        datas[0].preview_date = Date.now();
        await datas[0].save();
      } else {
        const preview = new Preview({
          good: goodId,
          user: user_id,
          preview_date: Date.now(),
        });
        await preview.save();
      }
      res.json(new CommonResBody('200', 'success', null));
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).send(null);
    }
  }

  // 物品上架
  @Post('putaway')
  async goodPutaway(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    try {
      const goodId = req.body.id as string;
      await Good.findByIdAndUpdate(goodId, {
        on_sale: true,
        update_time: Date.now(),
      });
      res.json(new CommonResBody('200', 'success', null));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(null);
    }
  }

  // 物品下架
  @Post('offline')
  async goodOffline(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    try {
      const goodId = req.body.id as string;
      await Good.findByIdAndUpdate(goodId, {
        on_sale: false,
        update_time: Date.now(),
      });
      res.json(new CommonResBody('200', 'success', null));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(null);
    }
  }
}
