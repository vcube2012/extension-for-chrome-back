import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export function ExceptionHandlerDecorator() {
  return function <T extends { new (...args: any[]) }>(constructor: T) {
    const logger = new Logger(constructor.name); // Get logger for the class

    console.log(234567);

    // Iterate over the prototype's methods
    for (const propertyName of Object.getOwnPropertyNames(
      constructor.prototype,
    )) {
      const originalMethod = constructor.prototype[propertyName];

      // Check if it's a function and not a constructor
      if (
        typeof originalMethod === 'function' &&
        propertyName !== 'constructor'
      ) {
        constructor.prototype[propertyName] = async function (...args: any[]) {
          try {
            logger.log(`Executing resolver: ${propertyName}`);
            const result = await originalMethod.apply(this, args);
            logger.log(`Resolver ${propertyName} completed successfully`);
            return result;
          } catch (error) {
            logger.error(
              `Error in resolver: ${propertyName} - ${error.message}`,
              error.stack,
            );

            // Map errors to appropriate exceptions (customize as needed)
            if (error?.statusCode >= 500) {
              throw new InternalServerErrorException('Internal Server Error');
            } else if (error?.statusCode === 403) {
              throw new ForbiddenException('Forbidden');
            } else if (error.message?.length > 70) {
              throw new BadRequestException('Bad Request');
            } else {
              throw new BadRequestException(error.message);
            }
          }
        };
      }
    }

    return constructor;
  };
}
