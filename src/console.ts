import { CommandFactory } from 'nest-commander';
import { ConsoleModule } from './app/modules/console/console.module';

async function bootstrap() {
  await CommandFactory.run(ConsoleModule, ['warn', 'error']);
}

bootstrap();
