import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AmqpModule, rabbitmqConfig } from '@app/amqp';

@Module({
  imports: [AmqpModule, ConfigModule.forRoot({ isGlobal: true, load: [rabbitmqConfig] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
