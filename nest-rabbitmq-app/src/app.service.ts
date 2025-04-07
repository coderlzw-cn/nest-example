import { Inject, Injectable, Logger } from '@nestjs/common';
import { AmqpService, rabbitmqConfig } from '@app/amqp';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(rabbitmqConfig.KEY)
    private readonly amqpConfig: ConfigType<typeof rabbitmqConfig>,
    private readonly amqpService: AmqpService,
  ) {
    console.log(amqpConfig.queue);
    console.log(amqpConfig.exchange);
  }

  sendMessage() {
    this.amqpService.publishMessageToExchange('Hello World!');
  }

  @RabbitSubscribe({
    exchange: 'exchanges_test',
    routingKey: 'routingKey_test',
    queue: `queue_test`,
    queueOptions: { durable: true },
  })
  subscribe(data: any, consumeMessage: ConsumeMessage) {
    const { routingKey, exchange } = consumeMessage.fields;
    this.logger.debug(`amqp receive msg,exchange is ${exchange},routingKey is ${routingKey},msg is ${JSON.stringify(data)}`);
  }
}
