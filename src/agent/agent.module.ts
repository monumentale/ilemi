import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { Agent,AgentSchema } from './schema/agent.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema}])],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
