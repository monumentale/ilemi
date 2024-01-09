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
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' })
    Tenantid: mongoose.Types.ObjectId;

    @ApiProperty()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Property' })
    Propertyid: mongoose.Types.ObjectId;

    @ApiProperty()
    @Prop()
    ApplicationDate: Date;   

    
    @ApiProperty()
    @Prop()
    RentExpirationdate: Date;   

    @ApiProperty()
    @Prop()
    VehiclesOnPremises: Boolean;   

    @ApiProperty()
    @Prop()
    OtherPeopleLivingInTheProperty: Boolean;   

    // "VehiclesOnPremises": true,
    // "OtherPeopleLivingInTheProperty": true,
  
}

export type PropertyDocument = Property & Document;
export const PropertySchema = SchemaFactory.createForClass(Property);
