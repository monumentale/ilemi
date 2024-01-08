import { Module, forwardRef } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Property, PropertySchema } from './schema/property.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentModule } from 'src/agent/agent.module';
import { TenantModule } from 'src/tenant/tenant.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Property.name, schema: PropertySchema}]),forwardRef(() =>AgentModule),forwardRef(() =>TenantModule)],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
