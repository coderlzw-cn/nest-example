import { Injectable } from '@nestjs/common';
import { ConsulService } from '@app/consul';

@Injectable()
export class AppService {
  constructor(private readonly consulService: ConsulService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
