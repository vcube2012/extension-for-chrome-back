import { Injectable } from '@nestjs/common';
import { CreateZipCodeDto } from './dto/create-zip-code.dto';
import { UpdateZipCodeDto } from './dto/update-zip-code.dto';

@Injectable()
export class ZipCodeService {
  create(createZipCodeDto: CreateZipCodeDto) {
    return 'This action adds a new zipCode';
  }

  findAll() {
    return `This action returns all zipCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zipCode`;
  }

  update(id: number, updateZipCodeDto: UpdateZipCodeDto) {
    return `This action updates a #${id} zipCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} zipCode`;
  }
}
