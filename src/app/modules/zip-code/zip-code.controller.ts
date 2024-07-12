import { Controller, Get, Param } from '@nestjs/common';
import { ZipCodeService } from './zip-code.service';

@Controller('zip-code')
export class ZipCodeController {
  constructor(private readonly zipCodeService: ZipCodeService) {}

  @Get()
  findAll() {
    return this.zipCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zipCodeService.findOne(+id);
  }
}
