import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AppRole } from '../../utils/utils.constant';
import * as mongoose from 'mongoose';
@Schema()
export class Property {
    @ApiProperty()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Agent' })
    AgentId: mongoose.Types.ObjectId;

    @ApiProperty()
    @Prop()
    Latitude: Number;

    @ApiProperty()
    @Prop()
    Longitude: Number;

    @ApiProperty()
    @Prop()
    Property_Name: String;

    @ApiProperty()
    @Prop({ default: 0 })
    Vacancy: Number;     //////   Vacant = 0   Occupied=   1

    @ApiProperty()
    @Prop({ default: 0 })
    TotalApplicants: Number;

    @ApiProperty()
    @Prop({ default: "ACTIVE" })
    status: String;   // ACTIVE  ARCHIVE  MAINTENANCE

    @ApiProperty()
    @Prop({ default: Date.now }) // Set default to the current timestamp when the property is created
    CreationDate: Date;

    @ApiProperty()
    @Prop()
    StreetAddress: String;

    @ApiProperty()
    @Prop()
    UnitNumber: String;

    @ApiProperty()
    @Prop()
    City: String;

    @ApiProperty()
    @Prop()
    State: String;

    @ApiProperty()
    @Prop()
    Zipcode: String;

    @ApiProperty()
    @Prop()
    Representiing: String;

    @ApiProperty()
    @Prop()
    PropertyType: String;

    @ApiProperty()
    @Prop()
    BedRooms: Number;

    @ApiProperty()
    @Prop()
    Baths: Number;

    @ApiProperty()
    @Prop()
    SquareFoot: Number;

    @ApiProperty()
    @Prop()
    MonthlyRent: Number;

    @ApiProperty()
    @Prop()
    SecurityDeposit: Number;

    @ApiProperty()
    @Prop()
    Description: String;

    @ApiProperty()
    @Prop()
    DateAvalaibality: Date;

    @ApiProperty()
    @Prop()
    LeaseDuration: String;

    @ApiProperty()
    @Prop([
        {
            title: String,
        },
    ])
    Amenities: {
        title: string;
    }[];


    @ApiProperty()
    @Prop([
        {
            title: String,
            url: String
        },
    ])
    ExteriorImages: {
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
    InteriorImages: {
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
    Videos: {
        title: string;
        url: String
    }[];

    @ApiProperty()
    @Prop([
        {
            Date: Date,
            price: String,
            event: String,
            source: String,
        },
    ])
    PriceHistory: {
        Date: Date,
        price: String,
        event: String,
        source: String,
    }[];



}

export type PropertyDocument = Property & Document;
export const PropertySchema = SchemaFactory.createForClass(Property);
