import { Controller, Redirect, Query, Get, HttpStatus, Post, Body, Param, Session, Put, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service'
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { getRedirectUrl } from '../tools/tools';
@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService:AuthService,
        private readonly configService:ConfigService,
    ){}

    @Get('login')
    async code2user(@Query() code:string, @Session() session, @Res() res: Response){
        const result = await this.authService.code2token(code)

    }

    @Get('userinfo')
    async me(@Session() session){

    }
}