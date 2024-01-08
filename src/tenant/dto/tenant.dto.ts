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

export class CreateTenantDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}

export class TenantDto {
    @ApiProperty()
    firstName: string;
  
    @ApiProperty()
    lastName: string;
  
    @ApiProperty()
    phoneNumber: string;
  
    @ApiProperty()
    email: string;
    
    @ApiProperty()
    uniqueVerificationCode:string
  
    @ApiProperty()
    externalUserId: string;
}

export class UpdateTenantDto extends TenantDto {
     @ApiProperty({ description: 'ID of the Tenant associated with the Tenant' })
     tenantId: string;
}
