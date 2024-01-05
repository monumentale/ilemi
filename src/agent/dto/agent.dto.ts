import { IsString, IsNumber, IsDate, IsEmail, IsArray, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';


export class ChangePasswordDTO {
    @ApiProperty()
    userid: string;

    @ApiProperty()
    newPassword: string;

    @ApiProperty()
    OldPassword: string;
}

class UploadeImageDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    url: string;
}

export class CreateAgentDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}

export class AgentDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phoneNumber: string;


    @ApiProperty()
    password: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    profilePic: string;

    @ApiProperty()
    status: boolean;

    @ApiProperty()
    AdmimVerificationStatus: boolean;

    @ApiProperty()
    HouseAddress: string;
  
    @ApiProperty()
    State: string;
  
    @ApiProperty()
    City: string;

    @ApiProperty()
    CompanyName: string;
  
    @ApiProperty()
    NINNumber: string;

    @ApiProperty()
    NINback:UploadeImageDto;

    @ApiProperty()
    NINfront:UploadeImageDto;
  
    @ApiProperty()
    WhatsappNumber: string;

    @ApiProperty({
        required: true,
        default: {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
        },
    })
    PropertyDataCount?: {
        Jan: number;
        Feb: number;
        Mar: number;
        Apr: number;
        May: number;
        Jun: number;
        Jul: number;
        Aug: number;
        Sep: number;
        Oct: number;
        Nov: number;
        Dec: number;
    };

    @ApiProperty()
    CreationDate: Date;

    @ApiProperty()
    uniqueVerificationCode: string;

    @ApiProperty()
    uniqueVerificationCodeTimer: Date;
}

export class UpdateAgentDto extends AgentDto {
     @ApiProperty({ description: 'ID of the agent associated with the agent' })
     agentId: string;
}