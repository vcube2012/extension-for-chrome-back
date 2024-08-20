import { ForbiddenError } from '@nestjs/apollo';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// error graphql handling decorator
export const ExceptionHandlerDecorator = (name?: string) => {
  const logger = new Logger();

  // return
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key = `\x1b[33m${_key}\x1b[0m`;

      try {
        logger.log(`Operation: ${key}`);

        return await originalMethod.apply(this, args);
      } catch (error) {
        logger.error(`Operation: ${_key}. Error: ${error.message}`, name);

        if (process.env.APP_ENV === 'local') {
          throw error;
        }

        if (error?.statusCode?.includes(50)) {
          throw new InternalServerErrorException('Internal Server Error');
        } else if (error?.statusCode?.includes(403)) {
          throw new ForbiddenError(error.message);
        } else if (error.message?.length > 70) {
          throw new BadRequestException('Bad Request');
        } else {
          throw new BadRequestException(error.message);
        }
      }
    };

    // return
    return descriptor;
  };
};
