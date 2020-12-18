import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CatDocument = Cat & Document;

@Schema()
export class Cat extends Document {

  @Prop({required:true, type: String})
  name: string;

  @Prop({required:true, type: Number, min:12, max:20})
  age: number;

}

export const CatSchema = SchemaFactory.createForClass(Cat);
