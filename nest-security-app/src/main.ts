import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://127.0.0.1:3000', // 允许的来源，可以是字符串或数组
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的HTTP方法
      allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
      exposedHeaders: ['X-Custom-Header'], // 允许客户端访问的响应头
      credentials: true, // 是否允许发送Cookie等凭证信息
      maxAge: 86400, // 预检请求的结果缓存时间（秒）
      preflightContinue: false, // 是否将预检请求传递给下一个处理器
      optionsSuccessStatus: 204, // 对于成功的OPTIONS请求返回的状态码
    },
  });
  await app.listen(process.env.PORT ?? 3000, '127.0.0.1');
}

void bootstrap();
