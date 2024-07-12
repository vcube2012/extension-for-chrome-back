import { Injectable } from '@nestjs/common';
import { UpdateZipCodeDto } from './dto/update-zip-code.dto';

@Injectable()
export class ZipCodeService {
  findAll() {
    return `This action returns all zipCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zipCode`;
  }
}
