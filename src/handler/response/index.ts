export class CommonResBody {
  code: string;
  msg: string;
  data: any;

  constructor(code: string, msg: string, data: any = null) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}
