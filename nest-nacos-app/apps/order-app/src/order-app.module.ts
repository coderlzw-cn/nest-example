import { Module } from '@nestjs/common';
import { OrderAppController } from './order-app.controller';
import { OrderAppService } from './order-app.service';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import * as path from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, '.env')
    }),
    OrderModule,
  ],
  controllers: [OrderAppController],
  providers: [OrderAppService],
})
export class OrderAppModule {}
