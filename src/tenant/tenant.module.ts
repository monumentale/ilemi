import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './schema/tenant.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema}])],
  controllers: [TenantController],
  providers: [TenantService],
  exports:[TenantService]
})
export class TenantModule {}
