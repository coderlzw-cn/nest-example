import { Global, Module, OnModuleInit } from '@nestjs/common';
import { AmqpService } from './amqp.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigType, registerAs } from '@nestjs/config';

export const rabbitmqConfig = registerAs('rabbitmq', () => ({
  uri: process.env.RABBITMQ_URI ?? '',
  exchange: process.env.RABBITMQ_EXCHANGE ?? '',
  exchangeType: process.env.RABBITMQ_EXCHANGE_TYPE ?? '',
  queue: process.env.RABBITMQ_QUEUE ?? '',
}));

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      inject: [rabbitmqConfig.KEY],
      useFactory: (configuration: ConfigType<typeof rabbitmqConfig>) => {
        return {
          exchanges: [
            {
              name: configuration.exchange,
              type: configuration.exchangeType,
              options: { durable: false },
            },
          ],
          uri: configuration.uri,
          connectionInitOptions: { wait: false },
        };
      },
    }),
  ],
  providers: [AmqpService],
  exports: [AmqpService],
})
export class AmqpModule implements OnModuleInit {
  constructor(private readonly amqpService: AmqpService) {}

  onModuleInit() {
    this.amqpService.monitorConn();
  }
}
