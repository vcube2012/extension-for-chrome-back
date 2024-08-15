import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';
import { IContextServer } from '../../graphql/graphql.module';
import { DatabaseService } from '../../../globals/database/database.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private db: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx: IContextServer =
      GqlExecutionContext.create(context).getContext();

    const token = this.extractTokenFromHeader(ctx.req);

    if (!token) {
      throw new BadRequestException('Token not found');
    }

    try {
      const userData = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      ctx.req.user = await this.db.user.findUniqueOrThrow({
        where: {
          id: userData.id,
        },
      });
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.raw?.headers?.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
