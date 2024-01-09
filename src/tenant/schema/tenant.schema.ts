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

    @ApiProperty()
    @Prop({ required: false })
    ResidencyStatus: string

    @ApiProperty()
    @Prop({ required: false })
    AdditionalComments: string

    @ApiProperty()
    @Prop({ required: false, default: false })
    VehiclesOnPremises: boolean

    @ApiProperty()
    @Prop({ required: false, default: false })
    OtherPeopleLivingInTheProperty: boolean

    @ApiProperty()
    @Prop()
    profilePic: string;




    ///////////////////////Objects//////////////////////////////
    @ApiProperty()
    @Prop({
        type: {
            title: String,
            name: String,
            dateofbirth: String,
            email: String,
            phoneNumber: String,
            DriversLicenceNumber: String,
            DriversLicenceState: String,
            NINNumber: String,
            HavingPet: Boolean,

        },
    })
    ApplicantPersonalDetails: {
        title: String,
        name: String,
        dateofbirth: String,
        email: String,
        phoneNumber: String,
        DriversLicenceNumber: String,
        DriversLicenceState: String,
        NINNumber: String,
        HavingPet: Boolean,
    };



    @ApiProperty()
    @Prop({
        type: {
            Fullname: String,
            Relationship: String,
            howManyYearsKnown: String,
            howManyMonthsKnown: String,
            email: String,
            PhoneNumber: String,

        },
    })
    PersonalRefrenceDetails: {
        Fullname: String,
        Relationship: String,
        howManyYearsKnown: String,
        howManyMonthsKnown: String,
        email: String,
        PhoneNumber: String,
    };



    @ApiProperty()
    @Prop({
        type: {
            EmploymentStatus: String,
            BussinessName: String,
            BussinessPhone: String,
            BussinessAddress: String,
            LGA: String,
            Zipcode: String,
            State: String,
            Country: String,
            EmploymentPosition: String,
            CurrentlyEmployedHere: Boolean,
            StarDate: Date,
            EndDate: Date,
            EmploymentType: String,
            GrossAnnualIncome: Number,
        },
    })
    EmploymentStatus: {
        EmploymentStatus: String,
        BussinessName: String,
        BussinessPhone: String,
        BussinessAddress: String,
        LGA: String,
        Zipcode: String,
        State: String,
        Country: String,
        EmploymentPosition: String,
        CurrentlyEmployedHere: Boolean,
        StarDate: Date,
        EndDate: Date,
        EmploymentType: String,
        GrossAnnualIncome: Number,
    };



    @ApiProperty()
    @Prop({
        type: {
            SupervisorOrHrName: String,
            SupervisorPosition: String,
            phone: String,
            email: String,
        },
    })
    EmploymentRefrence: {
        SupervisorOrHrName: String,
        SupervisorPosition: String,
        phone: String,
        email: String,
    };



    @ApiProperty()
    @Prop({
        type: {
            LivingArrangements: String,
            ResidentialAddress: String,
            suburb: String,
            PostCode: String,
            State: String,
            Country: String,
            PhoneNumber: String,
            Email: String,
            CurrentlyLivingHere: Boolean,
            OnPeriodicLeave: Boolean,
            StartDate: Date,
            EndDate: Date,
            LeaseEndDate: Date,
            ReasonsForLeaving: String,
        },
    })
    CurrentLivingArrangments: {
        LivingArrangements: String,
        ResidentialAddress: String,
        suburb: String,
        PostCode: String,
        State: String,
        Country: String,
        PhoneNumber: String,
        Email: String,
        CurrentlyLivingHere: Boolean,
        OnPeriodicLeave: Boolean,
        StartDate: Date,
        EndDate: Date,
        LeaseEndDate: Date,
        ReasonsForLeaving: String,
    };



    @ApiProperty()
    @Prop({
        type: {
            LivingArrangements: String,
            ResidentialAddress: String,
            suburb: String,
            PostCode: String,
            State: String,
            Country: String,
            PhoneNumber: String,
            Email: String,
            CurrentlyLivingHere: Boolean,
            OnPeriodicLeave: Boolean,
            StartDate: Date,
            EndDate: Date,
            LeaseEndDate: Date,
            ReasonsForLeaving: String,
        },
    })
    PreviousLivingArrangments: {
        LivingArrangements: String,
        ResidentialAddress: String,
        suburb: String,
        PostCode: String,
        State: String,
        Country: String,
        PhoneNumber: String,
        Email: String,
        CurrentlyLivingHere: Boolean,
        OnPeriodicLeave: Boolean,
        StartDate: Date,
        EndDate: Date,
        LeaseEndDate: Date,
        ReasonsForLeaving: String,
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
