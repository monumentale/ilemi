import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @ApiProperty({ description: 'ID of the agent associated with the property' })
  AgentId: string;

//   @ApiProperty({ description: 'Status of the property', example: true })
//   status: boolean;

  @ApiProperty({ description: 'Type of property', example: 'House' })
  Property_Name: string;


  @ApiProperty({
    description: 'Vacancy status (0 for Vacant, 1 for Occupied)',
    example: 0,
    default: 0, // Set default value to 0
  })
  TotalApplicants: Number; 

  @ApiProperty({ description: 'Vacancy status (0 for Vacant, 1 for Occupied)', example: 0 })
  Vacancy: number;

  @ApiProperty({ description: 'Availability status', example: 'ACTIVE' })
  status: string;

  @ApiProperty()
  CreationDate: Date;

  @ApiProperty({ description: 'Street address of the property', example: '123 Main St' })
  StreetAddress: string;

  @ApiProperty({ description: 'Unit number of the property', example: 'Apt 1' })
  UnitNumber: string;

  @ApiProperty({ description: 'City of the property', example: 'Example City' })
  City: string;

  @ApiProperty({ description: 'State of the property', example: 'CA' })
  State: string;

  @ApiProperty({ description: 'ZIP code of the property', example: '12345' })
  Zipcode: string;

  @ApiProperty({ description: 'Representing information for the property', example: 'John Doe' })
  Representiing: string;

  @ApiProperty({ description: 'Type of property', example: 'Residential' })
  PropertyType: string;

  @ApiProperty({ description: 'Number of bedrooms in the property', example: 3 })
  BedRooms: number;

  @ApiProperty({ description: 'Number of bathrooms in the property', example: 2 })
  Baths: number;

  @ApiProperty({ description: 'Square footage of the property', example: 1500 })
  SquareFoot: number;

  @ApiProperty({ description: 'Monthly rent for the property', example: 2000 })
  MonthlyRent: number;

  @ApiProperty({ description: 'Security deposit for the property', example: 1000 })
  SecurityDeposit: number;

  @ApiProperty({ description: 'Description of the property', example: 'A beautiful house with a garden' })
  Description: string;

  @ApiProperty()
  DateAvalaibality: Date;

  @ApiProperty({ description: 'Lease duration for the property', example: '12 months' })
  LeaseDuration: string;


  @ApiProperty({ type: () => [AmenitiesDto] })
  @IsOptional()
  @IsArray()
  @Type(() => AmenitiesDto)
  Amenities: AmenitiesDto[];
  
  @ApiProperty({ type: () => [MediaDto] })
  @IsOptional()
  @IsArray()
  @Type(() => MediaDto)
  ExteriorImages: MediaDto[];
  
  @ApiProperty({ type: () => [MediaDto] })
  @IsOptional()
  @IsArray()
  @Type(() => MediaDto)
  InteriorImages: MediaDto[];

  @ApiProperty({ type: () => [MediaDto] })
  @IsOptional()
  @IsArray()
  @Type(() => MediaDto)
  Videos: MediaDto[];


  @ApiProperty({ type: () => [PriceHistoryDto] })
  @IsOptional()
  @IsArray()
  @Type(() => PriceHistoryDto)
  PriceHistory: PriceHistoryDto[];

}

class PriceHistoryDto{
    @ApiProperty()
    Date:Date;
    @ApiProperty()
    price: string;
    @ApiProperty()
    event: string;
    @ApiProperty()
    source: string;
}

class AmenitiesDto{
    @ApiProperty()
    title: string;
}

class MediaDto{
    @ApiProperty()
    title: string;
    
    @ApiProperty()
    url: string
}

export class UpdatePropertyDto extends CreatePropertyDto {
    @ApiProperty({ description: 'ID of the agent associated with the property' })
    propertyId: string;
}
