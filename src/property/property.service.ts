import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';
import { AgentService } from 'src/agent/agent.service';
import { Property } from './schema/property.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BaseResponseTypeDTO } from 'src/utils/utils.types';
import { TenantService } from 'src/tenant/tenant.service';


@Injectable()
export class PropertyService {
    constructor(@InjectModel(Property.name) private propertyModel: Model<Property>,
        private readonly AgentSrv: AgentService,
        private readonly TenantSrv: TenantService,) { }

    async countPropertiesByAgentId(agentId: string): Promise<number> {
        try {
            const count = await this.propertyModel.countDocuments({ AgentId: agentId });
            return count;
        } catch (error) {
            // Handle errors here
            throw new Error(error);
        }
    }


    async createProperty(createPropertyDto: CreatePropertyDto): Promise<Property> {

        /////  check if user has paid , check the current plan, then check if he should continue upload depending on the payment package
        try {
            // Check if the agent exists
            const agent = await this.AgentSrv.findAgentById(createPropertyDto.AgentId);
            if (!agent) {
                throw new NotFoundException('Agent not found');
            }
            // throw new BadRequestException('Invalid video ID');
            const NoOfPropertiesUploaded = await this.countPropertiesByAgentId(createPropertyDto.AgentId)
            if (agent.data.CurrentPlanName === "BASIC") {
                // BASIC Plan: 1 listing allowed, throw an error if NoOfPropertiesUploaded is greater than or equal to 1
                if (NoOfPropertiesUploaded >= 1) {
                    throw new NotFoundException('BASIC plan allows only 1 property listing.');
                }
            } else if (agent.data.CurrentPlanName === "SILVER") {
                // SILVER Plan: 15 listings allowed, throw an error if NoOfPropertiesUploaded is greater than or equal to 15
                if (NoOfPropertiesUploaded >= 15) {
                    throw new NotFoundException('SILVER plan allows only 15 property listings.');
                }
            } else if (agent.data.CurrentPlanName === "GOLD") {
                // GOLD Plan: 25 listings allowed, throw an error if NoOfPropertiesUploaded is greater than or equal to 25
                if (NoOfPropertiesUploaded >= 25) {
                    throw new NotFoundException('GOLD plan allows only 25 property listings.');
                }
            } else if (agent.data.CurrentPlanName === "PLATINUM") {
                // PLATINUM Plan: Unlimited listings
                console.log("Keep uploading until you get tired!");
            } else {
                throw new NotFoundException('Broo No Vex Craete Another Account ....Abeg 😂');
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



    async TenantApplyForProperty() {
        ////// validate if tenent agent and property exits
        ////// check if tenant has applied for the property
        ////// check if property is vacant or noit 
        //send mail and notification
    }

    async AgentApproveTenancyApllication() {
        ///   set property vacancy to 1
        //send mail and notification
    }



    async getAllPropertiesByAgentId(agentId: string): Promise<any[]> {
        return this.propertyModel.find({ AgentId: agentId }).populate("AgentId").exec();
    }

    async getPropertyStatistics(agentId: string | mongoose.Types.ObjectId) {
        // const properties = await this.propertyModel.find({ AgentId: agentId }).exec();
        const totalProperties = await this.propertyModel.countDocuments({ AgentId: agentId }).exec();
        const vacantProperties = await this.propertyModel.countDocuments({ AgentId: agentId, Vacancy: 0 }).exec();
        const occupiedProperties = await this.propertyModel.countDocuments({ AgentId: agentId, Vacancy: 1 }).exec();

        return {
            //   properties,
            totalProperties,
            vacantProperties,
            occupiedProperties,
        };
    }

    async countPropertiesByMonth(agentId: string): Promise<any> {
        const currentYear = new Date().getFullYear();

        const pipeline = [
            {
                $match: {
                    AgentId: new mongoose.Types.ObjectId(agentId),
                    CreationDate: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                        $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: { $toDate: '$CreationDate' } },
                    },
                    count: { $sum: 1 },
                    vacancy0: {
                        $sum: { $cond: [{ $eq: ['$Vacancy', 0] }, 1, 0] },
                    },
                    vacancy1: {
                        $sum: { $cond: [{ $eq: ['$Vacancy', 1] }, 1, 0] },
                    },
                },
            },
        ];

        const result = await this.propertyModel.aggregate(pipeline);

        const countByMonth = {};
        for (let month = 1; month <= 12; month++) {
            const monthKey = `${month}`;
            const entry = result.find((item) => item._id.month === month);
            countByMonth[monthKey] = {
                vacancy0: entry ? entry.vacancy0 || 0 : 0,
                vacancy1: entry ? entry.vacancy1 || 0 : 0,
            };
        }
        return countByMonth;
    }


    async countPropertiesByWeek(agentId: string): Promise<any> {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Set to the first day (Sunday) of the current week

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day (Saturday) of the current week

        const pipeline = [
            {
                $match: {
                    AgentId: new mongoose.Types.ObjectId(agentId),
                    CreationDate: {
                        $gte: startOfWeek,
                        $lt: endOfWeek,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        dayOfWeek: { $dayOfWeek: { $toDate: '$CreationDate' } },
                    },
                    count: { $sum: 1 },
                    vacancy0: {
                        $sum: { $cond: [{ $eq: ['$Vacancy', 0] }, 1, 0] },
                    },
                    vacancy1: {
                        $sum: { $cond: [{ $eq: ['$Vacancy', 1] }, 1, 0] },
                    },
                },
            },
        ];

        const result = await this.propertyModel.aggregate(pipeline);

        const countByDay = {};
        for (let day = 1; day <= 7; day++) {
            const dayKey = `${day}`;
            const entry = result.find((item) => item._id.dayOfWeek === day);
            countByDay[dayKey] = {
                vacancy0: entry ? entry.vacancy0 || 0 : 0,
                vacancy1: entry ? entry.vacancy1 || 0 : 0,
            };
        }

        return countByDay;
    }


    // // Helper function to get the week number of a date
    // getWeekNumber(date: Date): number {
    //     const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    //     const dayNum = d.getUTCDay() || 7;
    //     d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    //     const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    //     return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    // }

    // // Helper function to get the first day of the week
    // getFirstDayOfWeek(year: number, week: number): Date {
    //     const januaryFirst = new Date(year, 0, 1);
    //     const daysToMonday = januaryFirst.getDay() === 0 ? 1 : 8 - januaryFirst.getDay();
    //     const firstMonday = new Date(januaryFirst);
    //     firstMonday.setDate(januaryFirst.getDate() + daysToMonday);
    //     const daysToAdd = (week - 1) * 7;
    //     return new Date(firstMonday.setDate(firstMonday.getDate() + daysToAdd));
    // }

    // // Helper function to get the last day of the week
    // getLastDayOfWeek(year: number, week: number): Date {
    //     const firstDay = this.getFirstDayOfWeek(year, week);
    //     return new Date(firstDay.setDate(firstDay.getDate() + 6));
    // }

    // async countPropertiesByWeek2(agentId: string): Promise<any> {
    //     const currentDate = new Date();
    //     const currentYear = currentDate.getFullYear();
    //     const currentWeek = this.getWeekNumber(currentDate);

    //     const pipeline = [
    //         {
    //             $match: {
    //                 AgentId: new mongoose.Types.ObjectId(agentId),
    //                 CreationDate: {
    //                     $gte: this.getFirstDayOfWeek(currentYear, currentWeek),
    //                     $lt: this.getLastDayOfWeek(currentYear, currentWeek),
    //                 },
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: {
    //                     dayOfWeek: { $dayOfWeek: { $toDate: '$CreationDate' } },
    //                 },
    //                 count: { $sum: 1 },
    //                 vacancy0: {
    //                     $sum: { $cond: [{ $eq: ['$Vacancy', 0] }, 1, 0] },
    //                 },
    //                 vacancy1: {
    //                     $sum: { $cond: [{ $eq: ['$Vacancy', 1] }, 1, 0] },
    //                 },
    //             },
    //         },
    //     ];

    //     const result = await this.propertyModel.aggregate(pipeline);

    //     const countByDayOfWeek = {};
    //     for (let day = 1; day <= 7; day++) {
    //         const dayKey = `${day}`;
    //         const entry = result.find((item) => item._id.dayOfWeek === day);
    //         countByDayOfWeek[dayKey] = {
    //             vacancy0: entry ? entry.vacancy0 || 0 : 0,
    //             vacancy1: entry ? entry.vacancy1 || 0 : 0,
    //         };
    //     }
    //     return countByDayOfWeek;
    // }





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
