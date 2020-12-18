import { Body, Post, Logger } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ConfigGateway } from './config.gateway';

import { CreateConfigDto } from './dto/config.dto'
import { QueryConfigDto } from './dto/config.query.dto';

@Controller('config')
export class ConfigController {
    constructor(
        private readonly configGateway: ConfigGateway
      ) { }

    @Post('/get')
    async getValueFromServer(@Body() queryConfigDto:QueryConfigDto){
       const res=  await this.configGateway.getValueFromServer(queryConfigDto)
        return res
   }

   @Post('/update')
    async updateKeyToServer(@Body() createCatDto:CreateConfigDto){
        this.configGateway.updateKeyToServer(createCatDto)
        return 'ok'
   }

   @Post('/delete')
    async deleteKey(@Body() queryConfigDto:QueryConfigDto){
        this.configGateway.deleteKey(queryConfigDto)
        return 'ok'
   }

   @Post('/create')
   async addCat(@Body() createCatDto:CreateConfigDto){
        this.configGateway.createKey(createCatDto)
        return 'ok'
  }
}
