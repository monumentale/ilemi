import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AppRole } from '../../utils/utils.constant';
import * as mongoose from 'mongoose';
@Schema()
export class Agent {
  @ApiProperty()
  @Prop({ required: false })
  firstName: string;

  @ApiProperty()
  @Prop({ required: false })
  lastName: string;

  @ApiProperty()
  @Prop({ required: false })
  phoneNumber: string;

  @ApiProperty()
  @Prop({ required: false })
  externalUserId: string;

  @ApiProperty()
  @Prop({ required: false })
  CompanyName: string;

  @ApiProperty()
  @Prop({ required: false })
  NINNumber: string;

  @ApiProperty()
  @Prop({
    type: {
      Jan: { type: Number, default: 0 }, // Set the default value for Jan
      Feb: { type: Number, default: 0 },
      Mar: { type: Number, default: 0 },
      Apr: { type: Number, default: 0 },
      May: { type: Number, default: 0 },
      Jun: { type: Number, default: 0 },
      Jul: { type: Number, default: 0 },
      Aug: { type: Number, default: 0 },
      Sep: { type: Number, default: 0 },
      Oct: { type: Number, default: 0 },
      Nov: { type: Number, default: 0 },
      Dec: { type: Number, default: 0 },
    },
  })
  PropertyDataCount: {
    Jan: Number,
    Feb: Number,
    Mar: Number,
    Apr: Number,
    May: Number,
    Jun: Number,
    Jul: Number,
    Aug: Number,
    Sep: Number,
    Oct: Number,
    Nov: Number,
    Dec: Number,
  };

  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop({ default: AppRole.Agent })
  role: AppRole;

  @ApiProperty()
  @Prop()
  profilePic: string;

  @ApiProperty()
  @Prop()
  HouseAddress: string

  @ApiProperty()
  @Prop({
    type: {
      name: String,
      url: String,
    },
  })
  NINback: {
    name: string,
    url: string
  };


  @ApiProperty()
  @Prop({
    type: {
      name: String,
      url: String,
    },
  })
  NINfront: {
    name: string,
    url: string
  };


  @ApiProperty()
  @Prop()
  State: string;

  @ApiProperty()
  @Prop()
  City: string;

  @ApiProperty()
  @Prop()
  WhatsappNumber: string;


  @ApiProperty()
  @Prop({ default: false })
  status: boolean;

  @ApiProperty()
  @Prop({ default: false })
  AdmimVerificationStatus: boolean;


  @ApiProperty()
  @Prop()
  CreationDate: Date;

  @ApiProperty()
  @Prop({ default: false })
  uniqueVerificationCode: string;

  @ApiProperty()
  @Prop({ default: Date.now }) // Set default to the current time
  uniqueVerificationCodeTimer: Date;


}

export type AgentDocument = Agent & Document;
export const AgentSchema = SchemaFactory.createForClass(Agent);
