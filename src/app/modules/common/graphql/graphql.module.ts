import { Module } from '@nestjs/common';
import { GraphQLModule as GraphQLModuleClass } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserRepoInterface } from '../../../repositories/user/user-repo.interface';

interface IUser {
  user?: UserRepoInterface;
}

interface IContext {
  request: FastifyRequest & { extra?: { request: { rawHeaders: string[] } } };
  reply: FastifyReply;
}

export interface IContextServer {
  req: FastifyRequest & IUser;
  res: FastifyReply;
}

@Module({
  imports: [
    GraphQLModuleClass.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [
        // process.env.APP_ENV === 'production'
        //   ? ApolloServerPluginLandingPageDisabled()
        //   :
        ApolloServerPluginLandingPageLocalDefault(),
      ],
      autoSchemaFile: join(process.cwd(), 'src/app/schema.graphql'),
      subscriptions: { 'graphql-ws': true },
      path: '/graphql',
      introspection: true,
      context: async (
        request: IContext['request'],
        replay: IContext['reply'],
      ): Promise<IContextServer> => {
        return {
          req: {
            ...request,
            cookies: { ...request.cookies },
          },
          res: replay,
        };
      },
    }),
  ],
})
export class GraphqlModule {}
