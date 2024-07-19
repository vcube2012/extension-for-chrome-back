import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../globals/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async findOne(id: number) {
    return this.db.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.db.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async createUser(dto: CreateUserDto) {
    return this.db.user.create({
      data: {
        email: dto.email,
        name: dto.name,
      },
    });
  }
}
