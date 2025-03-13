import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Разрешает запросы с любых доменов
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешённые методы
    allowedHeaders: 'Content-Type,Authorization', // Разрешённые заголовки
    credentials: true, // Разрешает отправку cookies (если нужно)
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
