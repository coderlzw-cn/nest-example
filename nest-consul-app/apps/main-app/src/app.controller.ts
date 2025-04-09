import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

const routes = [
  {
    host: 'http://192.168.5.5:3000',
    path: ['/api/user', '/api/user/v2'],
  },
  {
    host: 'http://192.168.5.5:3001',
    path: ['/api/order'],
  },
  {
    host: 'http://192.168.5.5:3003',
    path: ['/api/product'],
  },
];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

const routeMap = {};
routes.forEach((route) => {
  for (const path of route.path) {
    routeMap[path] = route;
  }
});

console.log(Object.keys(routeMap));
