import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Request,
  Res,
  Search,
} from '@nestjs/common';
import userApi from 'src/request/user';
import { AuthService } from '../auth/index.provider';
import { Response } from 'express';
import { Collect } from 'src/db/modules/collect';
import { Preview } from 'src/db/modules/preview';
import { User } from 'src/db/modules/user';
import { CommonResBody } from 'src/handler/response';
import { Address } from 'src/db/modules/address';
import { I_AddressEditBody, I_UserGoodsQuery } from './type';
import { Good } from 'src/db/modules/goods/model';

@Controller('/user')
export class UserController {
  constructor(private authService: AuthService) {}

  // 登录
  @Get('login')
  async login(@Query() query, @Res({ passthrough: true }) res: Response) {
    try {
      const { data } = await userApi.login({
        js_code: query.code,
      });

      const { openid, session_key } = data;

      const token = this.authService.generateToken(openid);
      this.authService.saveSessionKey(openid, session_key);
      // TODO
      const result = await User.findOne({ openId: openid });
      if (!result) {
        const user = new User({ openId: openid });
        user.set(
          'avatar',
          'https://img0.baidu.com/it/u=3762686575,934747082&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1713286800&t=7d0ee6c4fb0795f27891d93ca60edb45',
        );
        user.set('name', '微信用户1');
        await user.save();
      }
      res.json({
        token,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send('login error').end();
    }
  }

  // 获取浏览历史
  @Get('history')
  async getHistory(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = req.headers['token'];
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      const result = await Preview.find({
        user: user_id,
      }).populate(['good', 'user']);
      res.json(new CommonResBody('200', 'success', result));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).end();
    }
  }

  // 获取浏览历史
  @Get('collect')
  async getCollects(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const token = req.headers['token'];
      const openId = this.authService.token2OpenId(token);
      const user_id = (await User.findOne({ openId }))._id;
      const result = await Collect.find({
        user: user_id,
      }).populate(['good', 'user']);
      res
        .status(HttpStatus.OK)
        .json(new CommonResBody('200', 'success', result));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).end();
    }
  }

  // 获取地址列表
  @Get('address')
  async getAddressList(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const token = request.headers['token'];
      const openId = this.authService.token2OpenId(token);
      const _id = (await User.findOne({ openId }))._id;
      const lists = (await Address.find({ user: _id })) ?? [];
      response.json(new CommonResBody('200', 'success', lists));
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).end();
    }
  }

  // 添加地址
  @Post('address-add')
  async addNewAddress(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      console.log('request', request);
      const token = request.headers['token'];
      const openId = this.authService.token2OpenId(token);
      const _id = (await User.findOne({ openId }))._id;
      const address = new Address(request.body);
      address.set('user', _id);
      await address.save();
      response
        .status(HttpStatus.OK)
        .json(new CommonResBody('200', 'success', null));
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).end();
    }
  }

  // 修改地址
  @Post('address-edit')
  async editAddress(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const token = request.headers['token'];
      const openId = this.authService.token2OpenId(token);
      const _id = (await User.findOne({ openId }))._id;
      const body = request.body as any as I_AddressEditBody;
      const { addressId, ...changes } = body;
      await Address.findByIdAndUpdate(body.addressId, changes);
      response
        .status(HttpStatus.OK)
        .json(new CommonResBody('200', 'success', null));
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).end();
    }
  }

  // 用户主页物品
  @Get('goods')
  async getUserGood(
    @Req() request: Request,
    @Query() query: I_UserGoodsQuery,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await User.findById(query.userId);
      const lists = await Good.aggregate([
        {
          $match: {
            author: user._id,
            on_sale: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $addFields: {
            author: { $arrayElemAt: ['$author', 0] },
          },
        },
        {
          $lookup: {
            from: 'previews',
            localField: '_d',
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
      const jsonData = {
        user,
        lists,
      };
      response.json(new CommonResBody('200', 'success', jsonData));
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).end();
    }
  }
}
