import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Paymentref extends Document {
    @Prop()
    Agent_id: string;

    @Prop()
    refrence_id: string;

    @Prop()
    planName: string;

    @Prop({ type: Number })
    amount: number;

    @Prop({ default: Date.now })
    Date: Date; // Set to current date when the paymentref is created

    @Prop({ default: 30 })
    HowManyDaysPlan: number; // Set to current time when the paymentref is created

    @Prop({ default: 30 })
    DateOfExpiration: Date; // Set to current time when the paymentref is created

    @Prop({ default: "Valid" })
    ExpirationStatus: string;
}

export const PaymentrefSchema = SchemaFactory.createForClass(Paymentref);
