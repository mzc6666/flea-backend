export class ClientSocketBody {
  event: string;
  data: any;
  constructor(event: string, data: any) {
    this.event = event;
    this.data = data;
  }
}
