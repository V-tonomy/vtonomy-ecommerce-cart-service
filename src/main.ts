import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PORTS, QueueConfig } from 'vtonomy';
import { CartModule } from './cart.module';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        process.env.RABBITMQ_URL ?? 'amqp://vtonomy:123456@localhost:5672',
      ],
      queue: 'cart_queue',
      queueOptions: QueueConfig.Cart_Client,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? PORTS.Cart_Service);
}
bootstrap();
