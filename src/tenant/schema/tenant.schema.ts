import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AppRole } from '../../utils/utils.constant';
import * as mongoose from 'mongoose';
@Schema()
export class Tenant {
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
    password: string;

    @ApiProperty()
    @Prop({ default: AppRole.TENANT })
    role: AppRole;


    @ApiProperty()
    @Prop({ required: false })
    status: boolean

    @ApiProperty()
    @Prop({ required: false })
    email: string;

    @ApiProperty()
    @Prop({ required: false })
    externalUserId: string;


    @ApiProperty()
    @Prop({ required: false })
    uniqueVerificationCode: string

}

export type TenantDocument = Tenant & Document;
export const TenantSchema = SchemaFactory.createForClass(Tenant);
