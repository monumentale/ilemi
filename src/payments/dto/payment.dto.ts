import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsPhoneNumber, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
    @ApiProperty({ description: 'Agent ID', type: String })
    @IsString()
    agent_id: string;

    @ApiProperty({ description: 'Plan Name', type: Number })
    @IsString()
    planNumber: Number;

    @ApiProperty({ description: 'How Many Days Plan', type: Number })
    @IsNumber()
    DurationOfPlan: number

}
