import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status: any) {
        if (err || !user) {
            return null;
        }
        return user;
    }
}