import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { canDelete, getRedirectUrl } from '../tools/tools';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly configService:ConfigService,
    ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const sess = request.session
    if(request.path==='/api/config/getAll'&&!sess.user){
        res.redirect(getRedirectUrl(this.configService.get('oauthAccessKey')));
    }
    if(request.path==='/api/config/delete'){
        return canDelete(sess.user.email)
    }
    return true;
  }
}