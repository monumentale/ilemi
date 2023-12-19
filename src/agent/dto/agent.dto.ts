import { IsString, IsNumber, IsDate, IsEmail, IsArray, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

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
    CreationDate: Date;
  
    @ApiProperty()
    uniqueVerificationCode: string;
  
    @ApiProperty()
    uniqueVerificationCodeTimer: Date;
  }