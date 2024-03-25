import { Controller, Get, Req, Res } from '@nestjs/common';
import { searchToObj } from 'src/handler/url';
import userApi from 'src/request/user';

@Controller('/user')
export class UserController {
  @Get('login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const code = searchToObj(req.url.split('?')[1])['code'];
      const result = await userApi.login({
        js_code: code,
      });
      console.log('result', result);
    } catch (error) {}
  }
}
