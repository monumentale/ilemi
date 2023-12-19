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
    status: boolean;

    @ApiProperty()
    @Prop()
    Property_type: String;

    @ApiProperty()
    @Prop({ default: 0 })
    Vacancy: Number;     //////   Vacant = 0   Occupied=   1

    @ApiProperty()
    @Prop({ default: 0 })
    Avalability: Number;   

    @ApiProperty()
    @Prop()
    CreationDate: Date;

}

export type PropertyDocument = Property & Document;
export const PropertySchema = SchemaFactory.createForClass(Property);
