import { Controller, Get, Post, Body, Patch, Param, Delete,Query,  NotFoundException,UseGuards} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { CreateAgentDto } from './dto/agent.dto';
import { UpdatePasswordDTO } from 'src/utils/utils.types';
import { OTPUserDTO } from 'src/auth/dto/auth.dto';


@ApiTags('Agent')
@Controller('Agent')
export class AgentController {
  constructor(private readonly AgentService: AgentService) {}

  @ApiOperation({ description: 'create employe' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Post()
  create(@Body() createEmployerDto: CreateAgentDto) {
    return this.AgentService.create(createEmployerDto);
  }


    // @ApiBearerAuth('JWT')
    @ApiOperation({ description: 'Verify user with unique-code after login or signup' })
    @ApiProduces('json')
    @ApiConsumes('application/json')
    @Post('/agentification/verify-signup-or-login-code/')
    async verifyCodeAfterSignup(
      @Body() payload:OTPUserDTO
    )
    // : Promise<BaseResponseTypeDTO> 
    {
    const {uniqueVerificationCode,userId}=payload
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
    // @Roles(AppRole.ADMIN,AppRole.EMPLOYER)
    // @UseGuards(RolesGuard)
    @Post('/verification/change-password')
    async changePassword(
      @Body() payload: UpdatePasswordDTO,
    ): Promise<any> {
      return await this.AgentService.changePassword(payload);
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
}
