import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageResolver } from './package.resolver';
import { UserPackageService } from '../../../repositories/package/user-package.service';

@Module({
  providers: [PackageService, PackageResolver, UserPackageService],
  exports: [PackageService],
})
export class PackageModule {}
