import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, UseGuards, Put, BadRequestException, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { ChangePasswordDTO, CreateAgentDto, UpdateAgentDto } from './dto/agent.dto';
import { BaseResponseTypeDTO, UpdatePasswordDTO } from 'src/utils/utils.types';
import { OTPUserDTO } from 'src/auth/dto/auth.dto';


@ApiTags('Agent')
@Controller('Agent')
export class AgentController {
  constructor(private readonly AgentService: AgentService) { }

  @ApiOperation({ description: 'create agent' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Post()
  create(@Body() createagentrDto: CreateAgentDto) {
    return this.AgentService.create(createagentrDto);
  }


  // @ApiBearerAuth('JWT')
  @ApiOperation({ description: 'Verify user with unique-code after login or signup' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Post('/agentification/verify-signup-or-login-code/')
  async verifyCodeAfterSignup(
    @Body() payload: OTPUserDTO
  )
  // : Promise<BaseResponseTypeDTO> 
  {
    const { uniqueVerificationCode, userId } = payload
    return await this.AgentService.verifyCodeAfterSignuporLogin(
      uniqueVerificationCode,
      userId,
    );
  }

  @ApiOperation({ description: 'Resend OTP after login' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Get('/agentResend-otp-code/:userId')
  async resendOTPAfterLogin(
    @Param('userId') userId: string,
  )
  // : Promise<BaseResponseTypeDTO>
  {
    return await this.AgentService.resendOTPAfterLogin(userId);
  }


  @ApiOperation({ description: 'Initiate forgot-password flow' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Get('/verification/initiate-forgot-password-flow/:email')
  async initiateForgotPasswordFlow(
    @Param('email') email: string,
  ): Promise<any> {
    return await this.AgentService.initiateForgotPasswordFlow(email);
  }

  @ApiOperation({ description: 'Finalize forgot-password flow' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Get('/verification/finalize-forgot-password-flow/:uniqueVerificationCode')
  async finalizeForgotPasswordFlow(
    @Param('uniqueVerificationCode') uniqueVerificationCode: string,
  ): Promise<any> {
    return await this.AgentService.finalizeForgotPasswordFlow(
      uniqueVerificationCode,
    );
  }

  @ApiOperation({ description: 'Change password' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  // @ApiBearerAuth('JWT')
  // @Roles(AppRole.ADMIN,AppRole.agentR)
  // @UseGuards(RolesGuard)
  @Post('/verification/change-password')
  async changePassword(
    @Body() payload: UpdatePasswordDTO,
  ): Promise<any> {
    return await this.AgentService.changePassword(payload);
  }


  @ApiOperation({ description: 'Change password' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Post('/change-password')
  @ApiBearerAuth('JWT')
  // @Roles(AppRole.ADMIN, AppRole.agentR)
  // @UseGuards(RolesGuard)
  async changePasswordAcc(
    @Body() payload: ChangePasswordDTO,
  ): Promise<any> {
    return await this.AgentService.changePasswordAcc(payload);
  }

  @ApiOperation({ summary: 'Update PropertyDataCount for the current month' })
  @ApiParam({ name: 'agentId', description: 'Agent ID', example: 'agent123' })
  @ApiResponse({ status: 200, description: 'PropertyDataCount updated successfully' })
  @Post('/:agentId/update-property-data-count')
  async updatePropertyDataCount(@Param('agentId') agentId: string) {
    try {
      const updatedAgent = await this.AgentService.updatePropertyDataCount(agentId);
      return { message: 'PropertyDataCount updated successfully', agent: updatedAgent };
    } catch (error) {
      return { error: error.message };
    }
  }



  @Get('get-agent-by-id/:agentId')
  @ApiOperation({ summary: 'Find agent by ID' })
  @ApiParam({ name: 'agentId', description: 'ID of the agent' })
  @ApiOkResponse({ description: 'Agent details' })
  @ApiNotFoundResponse({ description: 'Agent not found' })
  async findAgentById(@Param('agentId') agentId: string) {
    try {
      const agent = await this.AgentService.findAgentById(agentId);
      return agent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }


  @Put('/update-agent')
  @ApiOperation({ summary: 'Update an Agent' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Agent updated successfully', type: BaseResponseTypeDTO })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiNotFoundResponse({ description: 'Agent not found' })
  async updateAgent(@Body() updateAgentDto: UpdateAgentDto): Promise<BaseResponseTypeDTO> {
    try {
      const result = await this.AgentService.update(updateAgentDto);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }



  //  (CONTROLLER) DELETE REQUEST TO DELETE AN agentR IN THE DATABASE BY ID..........................................
  @ApiOperation({ description: `Delete agentr by Id` })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Delete('/deleteagentr/:id')
  // @ApiBearerAuth('JWT')
  // @Roles(AppRole.ADMIN)
  // @UseGuards(RolesGuard)
  async deleteagentr(@Param('id') id: string) {
    try {
      const agente = await this.AgentService.deleteAgentById(id);
      // If agente with the ID is not found;
      if (!agente) {
        throw new NotFoundException(`agente with ID ${id} not found.`);
      }
      // return this.agenteService.remove(+id);
      return { message: `agente with ID ${id} deleted.` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: `agente not found` };
      }
      throw error;
    }
  }
}
