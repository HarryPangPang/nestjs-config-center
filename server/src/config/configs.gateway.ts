import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { WebSocketGateway, WebSocketServer, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket, Server } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';
import { CreateConfigDto } from './dto/config.dto';
import { QueryConfigDto } from './dto/config.query.dto';
import { ConfigDocument, Config } from './schemas/config.schema';

@WebSocketGateway({ namespace: 'config' })
export class ConfigGateway implements OnGatewayConnection, OnGatewayDisconnect {
   constructor(
      @InjectModel('Config') private configModel: Model<ConfigDocument>,
      private readonly redis: RedisService,
   ) { }

   @WebSocketServer() server: Server;
   private logger: Logger = new Logger('ConfigServerGateway');
   private clientConnectMaps = new Map<Socket, unknown>()


   handleDisconnect(client: Socket) {
      this.logger.log(`客户端断开连接: ${client.id}`);
      this.clientConnectMaps.delete(client)
   }

   handleConnection(client: Socket) {
      this.clientConnectMaps.set(client, [])
      this.logger.log(`客户端连接成功 ${client.id}`);
   }

   //  客户端消息
   @SubscribeMessage('msgToServer')
   handleMessage(@MessageBody() payload: string, @ConnectedSocket() client: Socket): void {
      this.logger.log(`接收到客户端${client.id}请求${JSON.stringify(payload)}`)
   }

   // 从服务器获取key的值给客户端
   @SubscribeMessage('queryKeyFromServer')
   async queryKeyFromServer(@MessageBody() payload: QueryConfigDto, @ConnectedSocket() client: Socket ){
      const result = await this.findOne(payload)
      this.server.emit('queryKeyResult', result);
   }

   // 客户端通知服务端更新key
   @SubscribeMessage('updateKeyToServer')
   async updateKeyToServer(@MessageBody() payload:CreateConfigDto,@ConnectedSocket() client: Socket){
      await this.updateOne(payload)
      this.logger.debug('服务端更新成功')
   }

   // 客户端通知服务端删除key
   @SubscribeMessage('deleteKey')
   async deleteKey(@MessageBody() payload:QueryConfigDto,@ConnectedSocket() client: Socket){
      await this.deleteOne(payload)
      this.logger.debug('服务端删除成功')
   }

   // 客户端通知服务端新增key
   @SubscribeMessage('createKey')
   async createKey(@MessageBody() payload:CreateConfigDto,@ConnectedSocket() client: Socket){
      await this.createOne(payload)
      this.logger.debug('服务端新增成功')
   }

   /**
    * 通知客户端更新key
    * @param payload 
    */
   updateValueToClient(payload:CreateConfigDto){
      this.server.emit('updateValueToClient', payload);
   }

   /**
    * 通知客户端删除key
    * @param payload 
    */
   deleteValueToClient(payload:QueryConfigDto){
      this.server.emit('deleteValueToClient', payload);
   }

   /**
    * 发送消息给客户端
    * @param msg 
    */
   sendMsgToClient(msg: any) {
      this.server.emit('msgToClient', msg);
   }

   // 获取所有连接信息
   getWsConnected() {
      return this.clientConnectMaps
   }

   //findAll 查找所有配置
   async findAll(): Promise<Config[]> {
      return this.configModel.find().exec();
   }

   // findOne 查找单个value
   async findOne(createConfigDto: QueryConfigDto): Promise<unknown> {
      const key = `${createConfigDto.env}-${createConfigDto.depart}-${createConfigDto.group}-${createConfigDto.key}`
      const rValue = await this.redis.get(key)
      if (rValue) {
         return JSON.parse(rValue)
      }
      let result: CreateConfigDto = {
         depart: createConfigDto.depart,
         group: createConfigDto.group,
         env: createConfigDto.env,
         key: createConfigDto.key,
         value: null
      }
      const res:any = this.configModel.findOne({ 
         depart: createConfigDto.depart,
         group: createConfigDto.group, 
         env: createConfigDto.env,  
         key: createConfigDto.key 
       }).exec();
      if(res.depart&&res.key){
         await this.redis.set(key, res.value)
         result = res.value || null
      }
      return result
   }

   // deleteOne 删除一个配置
   async deleteOne(createConfigDto: QueryConfigDto): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
      const key = `${createConfigDto.env}-${createConfigDto.depart}-${createConfigDto.group}-${createConfigDto.key}`
      await this.redis.del(key)
      return this.configModel.deleteOne({ 
         depart: createConfigDto.depart,
         group: createConfigDto.group, 
         env: createConfigDto.env,  
         key: createConfigDto.key 
       }).exec();
   }

   // updateOne 更新一个配置
   async updateOne(createConfigDto: CreateConfigDto): Promise<string> {
      const key = `${createConfigDto.env}-${createConfigDto.depart}-${createConfigDto.group}-${createConfigDto.key}`
      const redisValue = await this.redis.get(key)
      if (redisValue && redisValue === JSON.stringify(createConfigDto)) {
         return 'ok'
      }
      await this.redis.set(key, JSON.stringify(createConfigDto))
      await this.configModel.updateOne({ 
         depart: createConfigDto.depart,
         group: createConfigDto.group, 
         env: createConfigDto.env,  
         key: createConfigDto.key 
       }, {
         value: createConfigDto.value
      }).exec()
      return 'ok'
   }

   //createOne 创建配置
  async createOne(createConfigDto: CreateConfigDto): Promise<string> {
   const key = `${createConfigDto.env}-${createConfigDto.depart}-${createConfigDto.group}-${createConfigDto.key}`
   const redisValue = await this.redis.get(key)
   if (redisValue && redisValue === JSON.stringify(createConfigDto)) {
      return 'ok'
   }
   await this.redis.set(key, JSON.stringify(createConfigDto))
   const createdCat = new this.configModel(createConfigDto);
   await createdCat.save();
   return 'ok' 
 }
}