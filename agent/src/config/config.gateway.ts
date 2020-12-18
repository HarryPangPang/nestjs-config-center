import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateConfigDto } from './dto/config.dto';
import { QueryConfigDto } from './dto/config.query.dto';
import * as localstorage from 'node-localstorage'

const db = new localstorage.LocalStorage('./.configCache')
@WebSocketGateway()
export class ConfigGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('ConfigClientGateway');

  @WebSocketServer()
  server: Server;

  /**
   * 通知服务端要key的值
   * @param queryConfigDto 
   */
  async getValueFromServer(payload: QueryConfigDto) {
    const key = `${payload.env}-${payload.depart}-${payload.group}-${payload.key}`
    if(db.getItem(key)){
      return db.getItem(key)
    }else{
      this.server.emit('queryKeyFromServer',payload)
      const res = await new Promise((resolve)=>{
        let count =0
        const timer = setInterval(()=>{
          count+=1
          if(count === 5){
            clearInterval(timer)
            resolve(null)
          }
          if(db.getItem(key)){
            clearInterval(timer)
            resolve(db.getItem(key))
          }
        },1000)
      })
      return res
    }
  }


  /**
   * 通知服务端要更新key的值
   * @param payload 
   */
  async updateKeyToServer(payload: CreateConfigDto) {
    const key = `${payload.env}-${payload.depart}-${payload.group}-${payload.key}`
    this.server.emit('updateKeyToServer', payload)
    db.setItem(key,payload.value || '')
  }

  /**
   * 通知服务端要删除key的值
   * @param payload 
   */
  deleteKey(payload: QueryConfigDto) {
    const key = `${payload.env}-${payload.depart}-${payload.group}-${payload.key}`
    this.server.emit('deleteKey', payload)
    db.removeItem(key)
  }

  /**
   * 通知服务端要新增key的值
   * @param payload 
   */
  createKey(payload: CreateConfigDto) {
    const key = `${payload.env}-${payload.depart}-${payload.group}-${payload.key}`
    this.server.emit('createKey', payload)
    db.setItem(key,payload.value || '')
  }
  

  // 服务端通知客户端更新key
  @SubscribeMessage('updateValueToClient')
  async updateValueToClient(@MessageBody() payload: CreateConfigDto): Promise<any> {
    this.logger.debug('服务端通知客户端更新key')
    const key = `${payload.env}-${payload.depart}-${payload.group}-${payload.key}`
    db.setItem(key,payload.value || '')
    return payload;
  }

  // 服务端通知客户端删除key
  @SubscribeMessage('deleteValueToClient')
  async deleteValueToClient(@MessageBody() payload: QueryConfigDto): Promise<any> {
    const key = `${payload.env}-${payload.depart}-${payload.group}-${payload.key}`
    db.removeItem(key)
    return payload;
  }

  // 获取key的查询结果
  @SubscribeMessage('queryKeyResult')
  async queryKeyResult(@MessageBody() payload: CreateConfigDto): Promise<any> {
    const key = `${payload.env}-${payload.depart}-${payload.group}-${payload.key}`
    if(payload.value){
      db.setItem(key,payload.value || '')
    }
  }

  // 订阅服务端消息
  @SubscribeMessage('msgToClient')
  async msgToClient(@MessageBody() data: any): Promise<any> {
    console.log(data)
    return data;
  }

  handleConnection() {
    this.logger.log('服务端连接成功');
  }

  handleDisconnect() {
    this.logger.log('服务端断开连接');
  }

}