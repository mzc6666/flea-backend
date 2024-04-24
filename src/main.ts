import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose, { Schema } from 'mongoose';
import { WsAdapter } from './modules/messages/ws.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });
  app.enableCors();
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(3000);
  await mongoose.connect('mongodb://127.0.0.1:27017/graduation-project');
}
bootstrap();
