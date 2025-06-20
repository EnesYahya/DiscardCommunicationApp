import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LivekitService } from './livekit.service';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class LivekitResolver {
  constructor(private readonly livekitService: LivekitService) {}

  @Mutation(() => String)
  async createAccessToken(
    @Args('identity', { nullable: true }) identity: string,
    @Args('chatId', { nullable: true }) chatId: string,
  ) {
    try {
      if (!identity || !chatId) {
        throw new UnauthorizedException('Identity and chatId are required');
      }
      return await this.livekitService.createAccessToken(identity, chatId);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Failed to create access token: ' + err.message);
    }
  }
}
