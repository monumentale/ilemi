import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Put, HttpStatus, BadRequestException } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { ChangePasswordDTO, CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto';
import { OTPUserDTO } from 'src/auth/dto/auth.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO, UpdatePasswordDTO } from 'src/utils/utils.types';


@ApiTags('Tenants')
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}


  @ApiOperation({ description: 'create Tenat' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Post()
  create(@Body() createTenatrDto: CreateTenantDto) {
    return this.tenantService.create(createTenatrDto);
  }


  // @ApiBearerAuth('JWT')
  @ApiOperation({ description: 'Verify user with unique-code after login or signup' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Post('/Tenatification/verify-signup-or-login-code/')
  async verifyCodeAfterSignup(
    @Body() payload: OTPUserDTO
  )
  // : Promise<BaseResponseTypeDTO> 
  {
    const { uniqueVerificationCode, userId } = payload
    return await this.tenantService.verifyCodeAfterSignuporLogin(
      uniqueVerificationCode,
      userId,
    );
  }

  @ApiOperation({ description: 'Resend OTP after login' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Get('/TenatResend-otp-code/:userId')
  async resendOTPAfterLogin(
    @Param('userId') userId: string,
  )
  // : Promise<BaseResponseTypeDTO>
  {
    return await this.tenantService.resendOTPAfterLogin(userId);
  }


  @ApiOperation({ description: 'Initiate forgot-password flow' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Get('/verification/initiate-forgot-password-flow/:email')
  async initiateForgotPasswordFlow(
    @Param('email') email: string,
  ): Promise<any> {
    return await this.tenantService.initiateForgotPasswordFlow(email);
  }

  @ApiOperation({ description: 'Finalize forgot-password flow' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Get('/verification/finalize-forgot-password-flow/:uniqueVerificationCode')
  async finalizeForgotPasswordFlow(
    @Param('uniqueVerificationCode') uniqueVerificationCode: string,
  ): Promise<any> {
    return await this.tenantService.finalizeForgotPasswordFlow(
      uniqueVerificationCode,
    );
  }

  @ApiOperation({ description: 'Change password' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  // @ApiBearerAuth('JWT')
  // @Roles(AppRole.ADMIN,AppRole.TenatR)
  // @UseGuards(RolesGuard)
  @Post('/verification/change-password')
  async changePassword(
    @Body() payload: UpdatePasswordDTO,
  ): Promise<any> {
    return await this.tenantService.changePassword(payload);
  }


  @ApiOperation({ description: 'Change password' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Post('/change-password')
  @ApiBearerAuth('JWT')
  // @Roles(AppRole.ADMIN, AppRole.TenatR)
  // @UseGuards(RolesGuard)
  async changePasswordAcc(
    @Body() payload: ChangePasswordDTO,
  ): Promise<any> {
    return await this.tenantService.changePasswordAcc(payload);
  }



  @Get('get-Tenant-by-id/:TenantId')
  @ApiOperation({ summary: 'Find Tenat by ID' })
  @ApiParam({ name: 'TenatId', description: 'ID of the Tenat' })
  @ApiOkResponse({ description: 'Tenat details' })
  @ApiNotFoundResponse({ description: 'Tenat not found' })
  async findTenatById(@Param('TenatId') TenatId: string) {
    try {
      const Tenat = await this.tenantService.findTenantById(TenatId);
      return Tenat;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }


  @Put('/update-Tenant')
  @ApiOperation({ summary: 'Update an Tenant' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tenat updated successfully', type: BaseResponseTypeDTO })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiNotFoundResponse({ description: 'Tenat not found' })
  async updateTenat(@Body() updateTenantDto: UpdateTenantDto): Promise<BaseResponseTypeDTO> {
    try {
      const result = await this.tenantService.update(updateTenantDto);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }



  //  (CONTROLLER) DELETE REQUEST TO DELETE AN TenatR IN THE DATABASE BY ID..........................................
  @ApiOperation({ description: `Delete Tenatr by Id` })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @Delete('/deleteTenant/:id')
  // @ApiBearerAuth('JWT')
  // @Roles(AppRole.ADMIN)
  // @UseGuards(RolesGuard)
  async deleteTenatr(@Param('id') id: string) {
    try {
      const Tenate = await this.tenantService.deleteTenantById(id);
      // If Tenate with the ID is not found;
      if (!Tenate) {
        throw new NotFoundException(`Tenate with ID ${id} not found.`);
      }
      // return this.TenateService.remove(+id);
      return { message: `Tenate with ID ${id} deleted.` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: `Tenate not found` };
      }
      throw error;
    }
  }
}
