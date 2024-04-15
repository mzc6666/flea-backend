import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from 'src/modules/auth/index.provider';
import { authApi } from 'src/request';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private authService: AuthService) {}
  use(req: Request, res: Response, next: NextFunction) {
    // TODO: 补齐access_token的逻辑和token的逻辑
    // 检查access_token 检查token是否过期
    next();
  }
}
