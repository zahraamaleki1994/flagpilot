import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FlagDocument = HydratedDocument<Flag>;

@Schema({ timestamps: true })
export class Flag {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ default: false })
  enabled: boolean;

  @Prop()
  description: string;

  @Prop({ required: true })
  createdBy: string;
}

export const FlagSchema = SchemaFactory.createForClass(Flag);