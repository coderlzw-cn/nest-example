import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'node:path';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  getHello(): string {
    this.mailerService
      .sendMail({
        to: '314607329@qq.com',
        from: 'coderlzw@qq.com',
        subject: 'Testing Nest MailerModule ✔',
        text: 'welcome-----',
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    return 'Hello World!';
  }

  getHello2(): string {
    this.mailerService
      .sendMail({
        to: '314607329@qq.com',
        from: 'coderlzw@qq.com',
        subject: 'Testing Nest MailerModule ✔',
        template: 'welcome',
        context: {
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    return 'Hello World!';
  }
}
