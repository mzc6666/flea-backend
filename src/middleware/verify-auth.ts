import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GLOBAL_CONFIGS } from 'src/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenMiddleWare implements NestMiddleware {
  verifyToken(token: string) {
    try {
      jwt.verify(token, GLOBAL_CONFIGS.appSecret) as any;
      return true;
    } catch (error) {
      return false;
    }
  }

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['token'] as string;
    if (this.verifyToken(token)) {
      next();
    } else {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Token expired or invalid' });
    }
  }
}
