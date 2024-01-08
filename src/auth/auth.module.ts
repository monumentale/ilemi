import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AgentModule } from 'src/agent/agent.module';
import { TenantModule } from 'src/tenant/tenant.module';

@Module({
  imports: [
    forwardRef(() => AgentModule,),
    forwardRef(() => TenantModule,),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
