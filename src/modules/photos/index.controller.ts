import { Controller, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AuthService } from '../auth/index.provider';
import { CommonResBody } from 'src/handler/response';

@Controller('photos')
export class PhotoController {
  constructor(private authService: AuthService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const token = req.headers['token'];
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            '-' +
            Date.now();
          cb(null, filename + path.extname(file.originalname));
        },
      }),
    }),
  )
  async uploadFile(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.json(new CommonResBody('200', 'upload success', request.file.filename));
  }
}
