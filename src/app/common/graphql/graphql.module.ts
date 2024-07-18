import { Module } from '@nestjs/common';
import { GraphQLModule as GraphQLModuleClass } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import GraphQLJSON from 'graphql-type-json';

@Module({
  imports: [
    GraphQLModuleClass.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageLocalDefault(),
      ],
      resolvers: { JSON: GraphQLJSON },
      autoSchemaFile: join(process.cwd(), 'src/app/schema.graphql'),
      subscriptions: { 'graphql-ws': true },
      path: '/graphql',
    }),
  ],
})
export class GraphqlModule {}
