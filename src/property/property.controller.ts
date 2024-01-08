import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpStatus, BadRequestException, Query } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';
import { Property } from './schema/property.schema';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Properties')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }


  @ApiOperation({ summary: 'Create a new property' })
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({ status: 201, description: 'Property created successfully', type: Property })
  @Post()
  async createProperty(@Body() createPropertyDto: CreatePropertyDto): Promise<Property> {
    return this.propertyService.createProperty(createPropertyDto);
  }

  @ApiOperation({ summary: 'Update a property by ID' })
  @ApiParam({ name: 'id', description: 'Property ID', example: '123' })
  @ApiBody({ type: UpdatePropertyDto })
  @ApiResponse({ status: 200, description: 'Property updated successfully', type: Property })
  @Put(':id')
  async updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<any> {
    return this.propertyService.update(id, updatePropertyDto);
  }


  @Get('/property_search/search')
  @ApiOperation({ summary: 'Search for properties' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Properties found successfully' })
  @ApiBadRequestResponse({ description: 'Invalid search query' })
  async searchProperty(
    @Query('searchTerm') searchTerm: string,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<any> {
    try {
      const result = await this.propertyService.searchProperty(searchTerm, skip, limit);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('count-by-month/:agentId')
  @ApiParam({ name: 'agentId', description: 'Agent ID', type: 'string', example: 'your-agent-id' })
  @ApiResponse({ status: 200, description: 'Count of properties by month', type: Object })
  async countPropertiesByMonth(@Param('agentId') agentId: string): Promise<any> {
    const result = await this.propertyService.countPropertiesByMonth(agentId);
    return result;
  }


  @Get('statistics/:agentId')
  @ApiOperation({ summary: 'Get Property Statistics for an Agent' })
  @ApiParam({ name: 'agentId', description: 'Agent ID' })
  async getPropertyStatistics(@Param('agentId') agentId: string) {
    try {
      const statistics = await this.propertyService.getPropertyStatistics(agentId);
      return {
        success: true,
        code: 200,
        data: statistics,
        message: 'Property statistics retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: 'Internal Server Error',
        error: error.message || error,
      };
    }
  }

  @ApiOperation({ summary: 'Delete a property by ID' })
  @ApiParam({ name: 'id', description: 'Property ID', example: '123' })
  @ApiResponse({ status: 204, description: 'Property deleted successfully' })
  @Delete(':id')
  async deleteProperty(@Param('id') id: string): Promise<void> {
    return this.propertyService.deleteProperty(id);
  }

  @ApiOperation({ summary: 'Get all properties by Agent ID' })
  @ApiParam({ name: 'agentId', description: 'Agent ID', example: 'agent123' })
  @ApiResponse({ status: 200, description: 'List of properties', type: [Property] })
  @Get('/:agentId')
  async getAllPropertiesByAgentId(@Param('agentId') agentId: string): Promise<Property[]> {
    return this.propertyService.getAllPropertiesByAgentId(agentId);
  }
}
