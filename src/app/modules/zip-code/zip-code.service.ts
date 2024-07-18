import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class ZipCodeService {
  constructor(private readonly db: DatabaseService) {}

  findByCode(code: string) {
    return this.db.zipCode.findUnique({
      where: {
        code: code,
      },
    });
  }

  findManyByCodes(codes: string[]) {
    return this.db.zipCode.findMany({
      where: {
        code: {
          in: codes,
        },
      },
    });
  }
}
