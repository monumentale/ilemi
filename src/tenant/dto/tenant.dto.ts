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


class UploadeImageDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    url: string;
}

class ApplicantPersonalDetailsDto {
    @ApiProperty()
    title: String;
    @ApiProperty()
    name: String;
    @ApiProperty()
    dateofbirth: String;
    @ApiProperty()
    email: String;
    @ApiProperty()
    phoneNumber: String;
    @ApiProperty()
    DriversLicenceNumber: String;
    @ApiProperty()
    DriversLicenceState: String;
    @ApiProperty()
    NINNumber: String;
    @ApiProperty()
    HavingPet: Boolean;
}


class PersonalRefrenceDetailDto {
    @ApiProperty()
    Fullname: String;
    @ApiProperty()
    Relationship: String;
    @ApiProperty()
    howManyYearsKnown: String;
    @ApiProperty()
    howManyMonthsKnown: String;
    @ApiProperty()
    email: String;
    @ApiProperty()
    PhoneNumber: String;
}

class EmploymentStatusDto {
    @ApiProperty()
    EmploymentStatus: String;
    @ApiProperty()
    BussinessName: String;
    @ApiProperty()
    BussinessPhone: String;
    @ApiProperty()
    BussinessAddress: String;
    @ApiProperty()
    LGA: String;
    @ApiProperty()
    Zipcode: String;
    @ApiProperty()
    State: String;
    @ApiProperty()
    Country: String;
    @ApiProperty()
    EmploymentPosition: String;
    @ApiProperty()
    CurrentlyEmployedHere: Boolean;
    @ApiProperty()
    StarDate: Date;
    @ApiProperty()
    EndDate: Date;
    @ApiProperty()
    EmploymentType: String;
    @ApiProperty()
    GrossAnnualIncome: Number;
}

class EmploymentRefrenceDto {
    @ApiProperty()
    SupervisorOrHrName: String;
    @ApiProperty()
    SupervisorPosition: String;
    @ApiProperty()
    phone: String;
    @ApiProperty()
    email: String;

}

class LivingArrangementsDto {
    @ApiProperty()
    LivingArrangements: String;
    @ApiProperty()
    ResidentialAddress: String;
    @ApiProperty()
    suburb: String;
    @ApiProperty()
    PostCode: String;
    @ApiProperty()
    State: String;
    @ApiProperty()
    Country: String;
    @ApiProperty()
    PhoneNumber: String;
    @ApiProperty()
    Email: String;
    @ApiProperty()
    CurrentlyLivingHere: Boolean;
    @ApiProperty()
    OnPeriodicLeave: Boolean;
    @ApiProperty()
    StartDate: Date;
    @ApiProperty()
    EndDate: Date;
    @ApiProperty()
    LeaseEndDate: Date;
    @ApiProperty()
    ReasonsForLeaving: String;
}

export class TenantDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    CreationDate: Date;

    @ApiProperty()
    status: boolean

    @ApiProperty()
    email: string;

    @ApiProperty()
    externalUserId: string;


    @ApiProperty()
    uniqueVerificationCode: string

    @ApiProperty()
    ResidencyStatus: string

    @ApiProperty()
    AdditionalComments: string

    @ApiProperty()
    VehiclesOnPremises: boolean

    @ApiProperty()
    OtherPeopleLivingInTheProperty: boolean

    @ApiProperty()
    profilePic: string;

    @ApiProperty()
    ApplicantPersonalDetails: ApplicantPersonalDetailsDto;

    @ApiProperty()
    PersonalRefrenceDetails: PersonalRefrenceDetailDto;

    @ApiProperty()
    EmploymentStatus: EmploymentStatusDto

    @ApiProperty()
    EmploymentRefrence: EmploymentRefrenceDto;

    @ApiProperty()
    CurrentLivingArrangments: LivingArrangementsDto

    @ApiProperty()
    PreviousLivingArrangments: LivingArrangementsDto

    @ApiProperty({ type: () => [UploadeImageDto] })
    @IsOptional()
    @IsArray()
    @Type(() => UploadeImageDto)
    GroupA: UploadeImageDto[];


    @ApiProperty({ type: () => [UploadeImageDto] })
    @IsOptional()
    @IsArray()
    @Type(() => UploadeImageDto)
    GroupB: UploadeImageDto[];


    @ApiProperty({ type: () => [UploadeImageDto] })
    @IsOptional()
    @IsArray()
    @Type(() => UploadeImageDto)
    GroupC: UploadeImageDto[];


    @ApiProperty({ type: () => [UploadeImageDto] })
    @IsOptional()
    @IsArray()
    @Type(() => UploadeImageDto)
    SupportingDocuments: UploadeImageDto[];


}

export class UpdateTenantDto extends TenantDto {
    @ApiProperty({ description: 'ID of the Tenant associated with the Tenant' })
    tenantId: string;
}
