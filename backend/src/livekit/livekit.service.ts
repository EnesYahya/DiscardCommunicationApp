import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class LivekitService {
  async createAccessToken(identity: string, roomName: string) {
    try {
      if (!process.env.LK_API_KEY || !process.env.LK_API_SECRET) {
        throw new UnauthorizedException('LiveKit API credentials not configured');
      }

      if (!identity || !roomName) {
        throw new UnauthorizedException('Identity and room name are required');
      }

      const at = new AccessToken(
        process.env.LK_API_KEY,
        process.env.LK_API_SECRET,
        {
          identity,
          name: identity,
        },
      );

      at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
      });

      return at.toJwt();
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Failed to create access token: ' + err.message);
    }
  }
}
