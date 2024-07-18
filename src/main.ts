import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const port = process.env.PORT;
  const env = process.env.NODE_ENV;

  const app = await NestFactory.create(AppModule);
  await app.listen(port, '0.0.0.0', () => {
    console.log(
      `server start on port - ${port}, env - ${env !== 'production' ? 'develop' : 'production'}`,
    );
  });
}
bootstrap().catch((err) => console.log(`--- server error: ${err.message}`));
