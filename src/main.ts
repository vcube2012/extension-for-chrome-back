import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const port = process.env.PORT;
  const env = process.env.NODE_ENV;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  app.enableCors();

  await app.listen(port, '0.0.0.0', () => {
    console.log(
      `server start on port - ${port}, env - ${env !== 'production' ? 'develop' : 'production'}`,
    );
  });
}
bootstrap().catch((err) => console.log(`--- server error: ${err.message}`));
