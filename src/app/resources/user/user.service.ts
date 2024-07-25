import { DatabaseService } from '../../globals/database/database.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async findOneById(id: number) {
    return this.db.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
  }
}
