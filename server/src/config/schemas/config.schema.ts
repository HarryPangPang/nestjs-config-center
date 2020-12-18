import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigDocument = Config & Document;

@Schema()
export class Config extends Document {

  @Prop({required:true})
  depart: string;

  @Prop({required:true})
  group: string;

  @Prop({required:true})
  env: string;

  @Prop({required:true, type: String})
  key: string;

  @Prop({required:true})
  value: string;

}


const configSchema = SchemaFactory.createForClass(Config);
configSchema.index({'departGroup':1, "key":1},{
  unique:true
})

export const ConfigSchema = configSchema
