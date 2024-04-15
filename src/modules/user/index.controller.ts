import { Controller, Get, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { searchToObj } from 'src/handler/url';
import userApi from 'src/request/user';
import { AuthService } from '../auth/index.provider';
import { Response } from 'express';
import { Collect } from 'src/db/modules/collect';
import { Preview } from 'src/db/modules/preview';
import { User } from 'src/db/modules/user';
import { CommonResBody } from 'src/handler/response';

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
      this.authService.saveAuthData(openid, {
        token,
        session_key,
      });
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
      }).populate('good');
      res.json(new CommonResBody('200', 'success', result));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).end();
    }
  }
}
