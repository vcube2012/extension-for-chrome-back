import { BadRequestException } from '@nestjs/common';

export class Manager {
  /**
   * The array of created "drivers".
   */
  protected drivers = {};

  /**
   * The registered custom driver creators.
   */
  protected customCreators = {};

  /**
   * Get a driver instance.
   */
  driver(driver: string) {
    if (!this.drivers.hasOwnProperty(driver)) {
      this.drivers[driver] = this.createDriver(driver);
    }

    return this.drivers[driver];
  }

  extend(driver: string, callback: any) {
    this.customCreators[driver] = callback;

    return this;
  }

  protected createDriver(driver: string) {
    if (this.customCreators.hasOwnProperty(driver)) {
      return this.callCustomCreator(driver);
    }

    const method = this.generateMethodFromDriver(driver);

    if (method in this) {
      return this[method]();
    }

    throw new BadRequestException(`Undefined driver - ${driver}`);
  }

  protected callCustomCreator(driver: string) {
    return this.customCreators[driver]();
  }

  private generateMethodFromDriver(driver: string) {
    return (
      'create' + driver.charAt(0).toUpperCase() + driver.slice(1) + 'Driver'
    );
  }
}