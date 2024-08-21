import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageResolver } from './package.resolver';

@Module({
  providers: [PackageService, PackageResolver],
  exports: [PackageService],
})
export class PackageModule {}
