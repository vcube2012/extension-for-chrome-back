import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async findByEmail(email: string) {
    return this.db.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
