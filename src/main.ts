import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // <-- stringlarni number/boolean ga aylantiradi
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(Number(process.env.PORT), () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
}
bootstrap();
