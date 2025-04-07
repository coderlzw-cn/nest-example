import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AmqpService {
  private readonly logger = new Logger(AmqpService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  /**
   * 监听 RabbitMQ 的连接和通道事件，用于监控连接状态。
   * 包括以下事件：
   * - 连接管理器的 'connect' 和 'disconnect' 事件
   * - 通道管理器的 'connect', 'error', 和 'close' 事件
   */
  monitorConn() {
    // 获取 RabbitMQ 的连接管理器实例
    // const amqpConnectionManager = this.amqpConnection.managedConnection;
    //
    // // 监听连接管理器的 'connect' 事件，当连接成功时触发
    // amqpConnectionManager.on('connect', () => {
    //   this.logger.log('rabbitmq broker connect');
    // });
    //
    // // 监听连接管理器的 'disconnect' 事件，当连接断开时触发
    // amqpConnectionManager.on('disconnect', () => {
    //   this.logger.error('rabbitmq broker disconnect');
    // });
    //
    // // 获取 RabbitMQ 的通道管理器实例
    // const channelWrapper = this.amqpConnection.managedChannel;
    //
    // // 监听通道管理器的 'connect' 事件，当通道连接成功时触发
    // channelWrapper.on('connect', () => {
    //   this.logger.log('rabbitmq channel connect');
    // });
    //
    // // 监听通道管理器的 'error' 事件，当通道发生错误时触发
    // channelWrapper.on('error', () => {
    //   this.logger.error('rabbitmq channel error');
    // });
    //
    // // 监听通道管理器的 'close' 事件，当通道关闭时触发
    // channelWrapper.on('close', () => {
    //   this.logger.error('rabbitmq channel close');
    // });
  }

  // exchange
  private readonly exc_test = `exchanges_open5g`;
  // routingKey
  private readonly routingKey_test = 'routingKey_websocket';

  /**
   * 发布消息到指定的 RabbitMQ 交换机和路由键
   * @param message - 要发布的消息内容
   */
  publishMessageToExchange(message: any) {
    this.amqpConnection.publish(this.exc_test, this.routingKey_test, message).then((res) => {
      this.logger.log(
        `Published message to exchange: ${this.exc_test}, routingKey: ${this.routingKey_test}, Status: ${res}, message: ${JSON.stringify(message)}`,
      );
    });
  }
}
