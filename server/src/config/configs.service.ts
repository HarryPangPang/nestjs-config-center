import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigDocument, Config } from './schemas/config.schema';
import { CreateConfigDto } from './dto/config.dto'
import { ConfigGateway } from './configs.gateway'
import { RedisService } from 'src/redis/redis.service';
import { QueryConfigDto } from './dto/config.query.dto';

@Injectable()
export class ConfigsService {

  constructor(
    @InjectModel('Config') private configModel: Model<ConfigDocument>,
    private readonly redis: RedisService,
    private readonly configGateway: ConfigGateway
  ) { }

  //createOne 创建配置
  async createOne(createConfigDto: CreateConfigDto): Promise<string> {
    const key = `${createConfigDto.env}-${createConfigDto.depart}-${createConfigDto.group}-${createConfigDto.key}`
    const redisValue = await this.redis.get(key)
    if(redisValue&&redisValue===createConfigDto.value){
        return 'ok'
    }
    await this.redis.set(key, JSON.stringify(createConfigDto))
    const createdCat = new this.configModel(createConfigDto);
    await createdCat.save();
    return 'ok' 
  }

  //findAll 查找所有配置
  async findAll(): Promise<Config[]> {
    return this.configModel.find().exec();
  }

  // findOne 查找单个value
  async findOne(queryConfigDto: QueryConfigDto): Promise<Config> {
    const key = `${queryConfigDto.env}-${queryConfigDto.depart}-${queryConfigDto.group}-${queryConfigDto.key}`
    const rValue = await this.redis.get(key)
    if (rValue) {
      return JSON.parse(rValue)
    }
    const result = await this.configModel.findOne({ 
      depart: queryConfigDto.depart,
      group: queryConfigDto.group, 
      env: queryConfigDto.env,  
      key: queryConfigDto.key 
    }).exec();

    await this.redis.set(key, result)
    return result
  }

  // deleteOne 删除一个配置
  async deleteOne(queryConfigDto: QueryConfigDto):Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }>{
    const key = `${queryConfigDto.env}-${queryConfigDto.depart}-${queryConfigDto.group}-${queryConfigDto.key}`
    await this.redis.del(key)
    this.configGateway.deleteValueToClient(queryConfigDto)
    return this.configModel.deleteOne({ 
      depart: queryConfigDto.depart,
      group: queryConfigDto.group, 
      env: queryConfigDto.env,  
      key: queryConfigDto.key 
    }).exec();
  }

  // updateOne 更新一个配置
  async updateOne(createConfigDto: CreateConfigDto):Promise<string>{
    const key = `${createConfigDto.env}-${createConfigDto.depart}-${createConfigDto.group}-${createConfigDto.key}`
    const redisValue = await this.redis.get(key)
    if(redisValue&&redisValue===createConfigDto.value){
      return 'ok'
    }
    this.configGateway.updateValueToClient(createConfigDto)
    await this.redis.set(key, JSON.stringify(createConfigDto))
    await this.configModel.updateOne({ 
      depart: createConfigDto.depart,
      group: createConfigDto.group, 
      env: createConfigDto.env,  
      key: createConfigDto.key 
    },{
      value: createConfigDto.value
    }).exec()
    return 'ok'
  }

  async getWsConnected(){
    return this.configGateway.getWsConnected()
  }
}
