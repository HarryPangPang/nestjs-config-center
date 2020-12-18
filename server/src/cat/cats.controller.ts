import { Controller, Res, Query, Get, HttpStatus, Post, Body, Param, NotFoundException, Put, Delete } from '@nestjs/common';
import { CatsService } from './cats.service'
import { CreateCatDto } from './dto/cat.dto';

@Controller('cats')
export class CatsController{
    constructor( 
        private readonly catsService: CatsService
    ) {}
    
    @Post('/create')
     async addCat(@Body() createCatDto:CreateCatDto){
        await this.catsService.create(createCatDto)
        return 'ok'
    }

    @Get('/get')
     async getCat(){
        
        return await this.catsService.findAll()
    }
}