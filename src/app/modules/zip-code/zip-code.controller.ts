import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZipCodeService } from './zip-code.service';
import { CreateZipCodeDto } from './dto/create-zip-code.dto';
import { UpdateZipCodeDto } from './dto/update-zip-code.dto';

@Controller('zip-code')
export class ZipCodeController {
  constructor(private readonly zipCodeService: ZipCodeService) {}

  @Post()
  create(@Body() createZipCodeDto: CreateZipCodeDto) {
    return this.zipCodeService.create(createZipCodeDto);
  }

  @Get()
  findAll() {
    return this.zipCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zipCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZipCodeDto: UpdateZipCodeDto) {
    return this.zipCodeService.update(+id, updateZipCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zipCodeService.remove(+id);
  }
}
