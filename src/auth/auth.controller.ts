import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO, SignUpDTO } from './dto/auth.dto';
import {
  ApiOperation,
  ApiProduces,
  ApiConsumes,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ description: 'Login with email and password' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  // @ApiResponse({ type: AuthResponseDTO })
  @Post('/Agentlogin')
  async login(@Body() payload: LoginUserDTO)
  // : Promise<AuthResponseDTO> 
  {
    return await this.authService.Agentlogin(payload);
  }

  @ApiOperation({ description: 'Sign Up with email and password' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  // @ApiResponse({ type: AuthResponseDTO })
  @Post('/AgentSignup')
  async AgentsignUp(@Body() payload: SignUpDTO)
  // : Promise<AuthResponseDTO> 
  {
    return await this.authService.AgentsignUp(payload);
  }




  @ApiOperation({ description: 'Login with email and password' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  // @ApiResponse({ type: AuthResponseDTO })
  @Post('/Tenantlogin')
  async tenatlogin(@Body() payload: LoginUserDTO)
  // : Promise<AuthResponseDTO> 
  {
    return await this.authService.Tenantlogin(payload);
  }

  @ApiOperation({ description: 'Sign Up with email and password' })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  // @ApiResponse({ type: AuthResponseDTO })
  @Post('/TenantSignup')
  async TenantsignUp(@Body() payload: SignUpDTO)
  // : Promise<AuthResponseDTO> 
  {
    return await this.authService.TenantsignUp(payload);
  }
}
