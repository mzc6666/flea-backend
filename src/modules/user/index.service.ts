import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/index.provider';

@Injectable()
export class UserService {
  constructor(private auth: AuthService) {}
}
