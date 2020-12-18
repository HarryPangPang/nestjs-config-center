import { Model } from 'mongoose';
import { Injectable,HttpService} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { getSignedQuery } from '../tools/tools';


interface Result {
    result: number,
    data: any,
    msg: string
}
@Injectable()
export class AuthService {
    constructor(
        private readonly configService:ConfigService,
        private readonly httpService: HttpService
    ){}
  
    public async code2token(code: string):Promise<Result>{
    }

    public async getUserInfo(accessToken: string):Promise<Result>{
    }

    public async getUserPrivs(accessToken: string):Promise<Result>{
    }
    

}
