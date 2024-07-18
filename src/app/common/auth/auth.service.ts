import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../resources/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  generateJwt(payload) {
    // реалізувати генерацію токена для користувача на основі даних в payload
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.userService.findByEmail(user.email);

    if (!userExists) {
      // зареєструвати користувача
      return;
    }

    return this.generateJwt({
      id: userExists.id,
      email: userExists.email,
    });
  }
}
