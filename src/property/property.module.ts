import { Module, forwardRef } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Property, PropertySchema } from './schema/property.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentModule } from 'src/agent/agent.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Property.name, schema: PropertySchema}]),forwardRef(() =>AgentModule)],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
