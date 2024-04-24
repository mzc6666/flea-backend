import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '../auth/index.provider';
import { Good } from 'src/db/modules/goods/model';
import { Request, Response } from 'express';
import { CommonResBody } from 'src/handler/response';
import { User } from 'src/db/modules/user';
import { Order } from 'src/db/modules/order';
import { OrderStatus } from 'src/config';
import { Preview } from 'src/db/modules/preview';
import { I_CancelOrder, I_Purchase } from './type';

@Controller('/orders')
export class OrdersController {
  constructor(private authService: AuthService) {}

  // 我发布的
  // OK
  @Get('my-publish')
  async myPublishs(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers['token'] as string;
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      const lists = await Good.aggregate([
        {
          $match: {
            author: user_id,
            on_sale: true,
          },
        },
        {
          $lookup: {
            from: 'previews',
            localField: '_id',
            foreignField: 'good',
            as: 'previewCount',
          },
        },
        {
          $addFields: {
            previewCount: { $size: '$previewCount' },
          },
        },
      ]);
      console.log('lists', lists);
      res.json(new CommonResBody('200', 'success', lists));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(null);
    }
  }

  // 我卖出的
  @Get('my-sales')
  async getMySale(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers['token'] as string;
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      const list = await Order.aggregate([
        {
          $match: {
            status: {
              $in: [OrderStatus.going, OrderStatus.complete],
            },
            user: user_id,
          },
        },
        {
          $lookup: {
            from: 'goods',
            localField: 'good',
            foreignField: '_id',
            as: 'good',
          },
        },
        {
          $lookup: {
            from: 'addresses',
            localField: 'address',
            foreignField: '_id',
            as: 'address',
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
            good: { $arrayElemAt: ['$good', 0] },
            address: { $arrayElemAt: ['$address', 0] },
            user: { $arrayElemAt: ['$user', 0] },
          },
        },
        {
          $match: {
            'good.on_sale': false,
          },
        },
      ]);
      res.json(new CommonResBody('200', 'success', list));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(null);
    }
  }

  // 我购买的
  @Get('my-purchase')
  async myPurchases(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers['token'] as string;
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      const lists = await Order.aggregate([
        {
          $match: {
            user: user_id,
            status: { $not: { $eq: OrderStatus.canceled } },
          },
        },
        {
          $lookup: {
            from: 'goods',
            localField: 'good',
            foreignField: '_id',
            as: 'good',
          },
        },
        {
          $addFields: {
            good: { $arrayElemAt: ['$good', 0] },
          },
        },
        {
          $lookup: {
            from: 'previews',
            localField: 'good._id',
            foreignField: 'good',
            as: 'previewCount',
          },
        },
        {
          $addFields: {
            previewCount: { $size: '$previewCount' },
          },
        },
      ]);
      res.json(new CommonResBody('200', 'success', lists));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(null);
    }
  }

  /* 物品购买 */
  @Post('purchase')
  async goodPurchase(
    @Res({ passthrough: true }) res: Response,
    @Headers() headers,
    @Body() body: I_Purchase.Body,
  ) {
    try {
      const token = headers['token'] as string;
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      // 更新物品的上下架状态
      await Good.findByIdAndUpdate(body.goodId, {
        on_sale: false,
      });
      const order = new Order({
        user: user_id,
        good: body.goodId,
        address: body.addressId,
        purchase_date: Date.now(),
        status: OrderStatus.going,
      });
      await order.save();
      res.json(new CommonResBody('200', 'success', null));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(null);
    }
  }

  /* 取消订单 */
  @Post('cancel')
  async cancelOrder(
    @Res({ passthrough: true }) res: Response,
    @Body() body: I_CancelOrder.Body,
  ) {
    try {
      const order = await Order.findByIdAndUpdate(body.id, {
        status: OrderStatus.canceled,
      });
      await Good.findByIdAndUpdate(order.good, {
        on_sale: true,
      });
      res.json(new CommonResBody('200', 'success', null));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(null);
    }
  }

  // 获取我下架的物品列表
  @Get('my-remove-sale')
  async myRemovedSales(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers['token'] as string;
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      const lists = await Good.aggregate([
        {
          $match: {
            author: user_id,
            on_sale: false,
          },
        },
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'good',
            as: 'order',
          },
        },
        {
          // TODO 筛选下架物品逻辑不完整
          $match: {
            $expr: { $eq: [{ $size: '$order' }, 0] },
          },
        },
        {
          $project: {
            photos: 1,
            desc: 1,
            price: 1,
            longitude: 1,
            latitude: 1,
            status: 1,
            publish_date: 1,
            author: 1,
            update_time: 1,
            on_sale: 1,
          },
        },
      ]);
      res.json(new CommonResBody('200', 'success', lists));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(null);
    }
  }
}
