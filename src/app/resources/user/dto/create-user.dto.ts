export class CreateUserDto {
  public name: string;
  public email: string;

  constructor(requestUser?: { email: string; name: string }) {
    if (requestUser) {
      this.email = requestUser.email;
      this.name = requestUser.name;
    }
  }
}
