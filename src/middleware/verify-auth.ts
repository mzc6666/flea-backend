import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from 'src/modules/auth/index.provider';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private auth: AuthService) {}
  use(req: Request, res: Response, next: NextFunction) {
    // TODO: 补齐access_token的逻辑和token的逻辑
    next();
  }
}
