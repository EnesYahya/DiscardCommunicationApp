import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { ServerModule } from './server/server.module';
import { ProfileModule } from './profile/profile.module';
import { MemberModule } from './member/member.module';
import { ChatModule } from './chat/chat.module';
import { TokenModule } from './token/token.module';
import { TokenService } from './token/token.service';
import { LivekitModule } from './livekit/livekit.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),

    GraphQLModule.forRootAsync({
      imports: [TokenModule],
      inject: [TokenService],
      driver: ApolloDriver,
      useFactory: async (tokenService: TokenService) => {
        return {
          installSubscriptionHandlers: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
// ...existing code...
subscriptions: {
  'subscriptions-transport-ws': {
    onConnect: async (connectionParams) => {
      // Accept standard Bearer token string
      const authHeader = connectionParams.headers?.authorization;
      if (!authHeader) throw new Error('Missing auth token!');
      // Remove 'Bearer ' prefix if present
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;
      const profile = await tokenService.validateToken(token);
      return { profile };
    },
  },
},
// ...existing code...
        };
      },
    }),

    ServerModule,

    ProfileModule,

    MemberModule,

    ChatModule,

    TokenModule,

    LivekitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
