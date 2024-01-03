import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';
import { AgentService } from 'src/agent/agent.service';
import { Property } from './schema/property.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BaseResponseTypeDTO } from 'src/utils/utils.types';


@Injectable()
export class PropertyService {
    constructor(@InjectModel(Property.name) private propertyModel: Model<Property>, private readonly AgentSrv: AgentService,) { }

    async createProperty(createPropertyDto: CreatePropertyDto): Promise<Property> {
        try {
            // Check if the agent exists
            const agent = await this.AgentSrv.findAgentById(createPropertyDto.AgentId);
            if (!agent) {
                throw new NotFoundException('Agent not found');
            }

            await this.AgentSrv.updatePropertyDataCount(createPropertyDto.AgentId);


            const partialProperty: Partial<CreatePropertyDto> = {
                ...createPropertyDto
            };
            const createdProperty = new this.propertyModel(partialProperty);
            return createdProperty.save();
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error; // Rethrow NotFoundException
            } else if (error.code === 11000) {
                // MongoDB duplicate key error (unique constraint violation)
                throw new ConflictException('Duplicate property entry'); // ConflictException for duplicate entry
            } else {
                throw new Error(`Error creating property: ${error.message}`);
            }
        }
    }

    async getAllPropertiesByAgentId(agentId: string): Promise<any[]> {
        return this.propertyModel.find({ AgentId: agentId }).populate("AgentId").exec();
    }

    async searchProperty(searchTerm: string, skip: number, limit: number): Promise<any> {
        try {
          const query = this.propertyModel.find({
            $or: [
              { StreetAddress: new RegExp(searchTerm, 'i') },
              { City: new RegExp(searchTerm, 'i') },
              { State: new RegExp(searchTerm, 'i') },
              { Zipcode: new RegExp(searchTerm, 'i') },
              { Representiing: new RegExp(searchTerm, 'i') },
              { PropertyType: new RegExp(searchTerm, 'i') },
              { Baths: parseInt(searchTerm) || 0 },
              { BedRooms: parseInt(searchTerm) || 0 },
              { MonthlyRent: parseFloat(searchTerm) || 0 },
              { SquareFoot: parseFloat(searchTerm) || 0 },
              { Description: new RegExp(searchTerm, 'i') },
              // Add other fields as needed
            ],
          });
      
          // Apply skip and limit to the query
          query.skip(skip).limit(limit);
      
          // Execute the query and return the result
          return query.exec();
        } catch (error) {
          // Handle errors here
          throw new Error(error);
        }
      }
      

    // async updateConnectionsByCondition(jobId: string, updateFields: any): Promise<void> {
    //     try {
    //       // Add the job ID to the condition

    //       // Use the updateMany method to update documents that match the condition
    //       await this.JobConnectionModel.updateMany(
    //         {
    //           job: jobId
    //         },
    //         { $set: updateFields } // Use $set to specify the fields to update
    //       ).exec();
    //     } catch (error) {
    //       // Handle any potential errors, e.g., by throwing a custom exception
    //       throw new Error('Failed to update connections.');
    //     }
    //   }

    async update(propertyid: string, updatePropertyDto: UpdatePropertyDto): Promise<BaseResponseTypeDTO> {
        try {
            if (!mongoose.Types.ObjectId.isValid(propertyid)) {
                throw new NotFoundException('Property ID is not valid');
            }

            let property = await this.propertyModel.findById(propertyid);
            if (!property?.id) {
                throw new NotFoundException('Property with ID not found');
            }

            // Check and update each property field if provided in the DTO
            if (updatePropertyDto.AgentId && this.toObjectId(updatePropertyDto.AgentId) !== property.AgentId) {
                property.AgentId = this.toObjectId(updatePropertyDto.AgentId);
            }

            if (updatePropertyDto.status !== undefined && updatePropertyDto.status !== property.status) {
                property.status = updatePropertyDto.status;
            }

            if (updatePropertyDto.Property_Name && updatePropertyDto.Property_Name !== property.Property_Name) {
                property.Property_Name = updatePropertyDto.Property_Name;
            }

            if (updatePropertyDto.Vacancy !== undefined && updatePropertyDto.Vacancy !== property.Vacancy) {
                property.Vacancy = updatePropertyDto.Vacancy;
            }

            // if (updatePropertyDto.Avalability && updatePropertyDto.Avalability !== property.Avalability) {
            //     property.Avalability = updatePropertyDto.Avalability;
            // }

            if (updatePropertyDto.CreationDate && updatePropertyDto.CreationDate !== property.CreationDate) {
                property.CreationDate = updatePropertyDto.CreationDate;
            }

            if (updatePropertyDto.StreetAddress && updatePropertyDto.StreetAddress !== property.StreetAddress) {
                property.StreetAddress = updatePropertyDto.StreetAddress;
            }

            if (updatePropertyDto.UnitNumber && updatePropertyDto.UnitNumber !== property.UnitNumber) {
                property.UnitNumber = updatePropertyDto.UnitNumber;
            }

            if (updatePropertyDto.City && updatePropertyDto.City !== property.City) {
                property.City = updatePropertyDto.City;
            }

            if (updatePropertyDto.State && updatePropertyDto.State !== property.State) {
                property.State = updatePropertyDto.State;
            }

            if (updatePropertyDto.Zipcode && updatePropertyDto.Zipcode !== property.Zipcode) {
                property.Zipcode = updatePropertyDto.Zipcode;
            }

            if (updatePropertyDto.Representiing && updatePropertyDto.Representiing !== property.Representiing) {
                property.Representiing = updatePropertyDto.Representiing;
            }

            if (updatePropertyDto.PropertyType && updatePropertyDto.PropertyType !== property.PropertyType) {
                property.PropertyType = updatePropertyDto.PropertyType;
            }
            

            if (updatePropertyDto.BedRooms !== undefined && updatePropertyDto.BedRooms !== property.BedRooms) {
                property.BedRooms = updatePropertyDto.BedRooms;
            }

            if (updatePropertyDto.Baths !== undefined && updatePropertyDto.Baths !== property.Baths) {
                property.Baths = updatePropertyDto.Baths;
            }

            if (updatePropertyDto.SquareFoot !== undefined && updatePropertyDto.SquareFoot !== property.SquareFoot) {
                property.SquareFoot = updatePropertyDto.SquareFoot;
            }

            if (updatePropertyDto.MonthlyRent !== undefined && updatePropertyDto.MonthlyRent !== property.MonthlyRent) {
                property.MonthlyRent = updatePropertyDto.MonthlyRent;
            }

            if (updatePropertyDto.SecurityDeposit !== undefined && updatePropertyDto.SecurityDeposit !== property.SecurityDeposit) {
                property.SecurityDeposit = updatePropertyDto.SecurityDeposit;
            }

            if (updatePropertyDto.Description && updatePropertyDto.Description !== property.Description) {
                property.Description = updatePropertyDto.Description;
            }

            if (updatePropertyDto.DateAvalaibality && updatePropertyDto.DateAvalaibality !== property.DateAvalaibality) {
                property.DateAvalaibality = updatePropertyDto.DateAvalaibality;
            }

            if (updatePropertyDto.LeaseDuration && updatePropertyDto.LeaseDuration !== property.LeaseDuration) {
                property.LeaseDuration = updatePropertyDto.LeaseDuration;
            }

            if (updatePropertyDto.Amenities && updatePropertyDto.Amenities !== property.Amenities) {
                property.Amenities = updatePropertyDto.Amenities;
            }

            if (updatePropertyDto.ExteriorImages && updatePropertyDto.ExteriorImages !== property.ExteriorImages) {
                property.ExteriorImages = updatePropertyDto.ExteriorImages;
            }

            if (updatePropertyDto.InteriorImages && updatePropertyDto.InteriorImages !== property.InteriorImages) {
                property.InteriorImages = updatePropertyDto.InteriorImages;
            }

            if (updatePropertyDto.Videos && updatePropertyDto.Videos !== property.Videos) {
                property.Videos = updatePropertyDto.Videos;
            }

            const savedProperty = await property.save();

            return {
                success: true,
                code: HttpStatus.OK,
                data: savedProperty,
                message: 'Property updated',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            } else {
                throw new Error(`Error updating property: ${error.message}`);
            }
        }
    }

    async deleteProperty(id: string): Promise<any> {
        try {
            if (!this.isValidObjectId(id)) {
                throw new BadRequestException('Invalid video ID');
            }
            const deletedVideo = await this.propertyModel.findByIdAndDelete(id).exec();
            if (!deletedVideo) {
                throw new NotFoundException(`Video with ID ${id} not found`);
            }
            return deletedVideo;
        } catch (error) {
            throw new BadRequestException('Video deletion failed', error.message);
        }
    }

    private async getPropertyById(id: string): Promise<Property | null> {
        return this.propertyModel.findById(id).exec();
    }
    private isValidObjectId(id: string): boolean {
        return mongoose.Types.ObjectId.isValid(id);
    }
    private toObjectId(id: string): mongoose.Types.ObjectId {
        return new mongoose.Types.ObjectId(id);
    }
}
