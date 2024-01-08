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
    @Prop({ default: Date.now }) // Set default to the current timestamp when the property is created
    CreationDate: Date;

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


    ///////////////////////Objects//////////////////////////////
    @ApiProperty()
    @Prop({
        type: {
            name: String,
            url: String,
        },
    })
    ApplicantPersonalDetails: {
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
    PersonalRefrenceDetails: {
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
    EmploymentStatus: {
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
    EmploymentRefrence: {
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
    CurrentLivingArrangments: {
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
    PreviousLivingArrangments: {
        name: string,
        url: string
    };


    ///////////////////////////////////////////////////////Special  Iamges ///////////////////////////////////////
    @ApiProperty()
    @Prop([
        {
            title: String,
            url: String
        },
    ])
    GroupA: {
        title: string;
        url: String
    }[];



    @ApiProperty()
    @Prop([
        {
            title: String,
            url: String
        },
    ])
    GroupB: {
        title: string;
        url: String
    }[];



    @ApiProperty()
    @Prop([
        {
            title: String,
            url: String
        },
    ])
    GroupC: {
        title: string;
        url: String
    }[];


    @ApiProperty()
    @Prop([
        {
            title: String,
            url: String
        },
    ])
    SupportingDocuments: {
        title: string;
        url: String
    }[];

}

export type TenantDocument = Tenant & Document;
export const TenantSchema = SchemaFactory.createForClass(Tenant);
