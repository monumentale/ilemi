import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { Agent,AgentSchema } from './schema/agent.schema';
import { Property,PropertySchema } from 'src/property/schema/property.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema},{ name: Property.name, schema: PropertySchema}])],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
