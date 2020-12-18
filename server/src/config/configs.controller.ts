import { Body, HttpCode, Post, Logger, Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { ConfigsService } from './configs.service'
import { CreateConfigDto } from './dto/config.dto'
import { QueryConfigDto } from './dto/config.query.dto';

@Controller('config')
export class ConfigController {
    constructor(
        private readonly configService:ConfigsService,
    ){}

    @Post('/create')
    async addCat(@Body() createCatDto:CreateConfigDto){
        return await this.configService.createOne(createCatDto)
   }

   @Post('/update')
    async updateCat(@Body() createCatDto:CreateConfigDto){
        return await this.configService.updateOne(createCatDto)
   }

   @Post('/delete')
    async deleteCat(@Body() queryConfigDto:QueryConfigDto){
        await this.configService.deleteOne(queryConfigDto)
       return 'ok'
   }

   @Post('/get')
    async getCat(@Body() queryConfigDto:QueryConfigDto){
       return await this.configService.findOne(queryConfigDto)
   }

   @Get('/getAll')
    async getAll(){
       const res = await this.configService.findAll()
       return {
           data:res,
           msg:'',
       }
   }

   @Get('/getWsConnected')
    async getWsConnected(){
       return await this.configService.getWsConnected()
   }
}
