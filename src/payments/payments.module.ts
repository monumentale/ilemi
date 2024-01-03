import { Module, forwardRef } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment,PaymentSchema } from './schema/payments.schema';
import { Paymentref,PaymentrefSchema } from './schema/paymentref.schema';
import { AgentModule } from 'src/agent/agent.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema},{ name: Paymentref.name, schema: PaymentrefSchema}]),forwardRef(() =>AgentModule)],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
