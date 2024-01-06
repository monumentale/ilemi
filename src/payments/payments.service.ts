import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { httpPost } from 'src/utils/utils.function';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schema/payments.schema';
import { Paymentref } from './schema/paymentref.schema';
import { Model } from 'mongoose';
import { AgentService } from 'src/agent/agent.service';
import { CreatePaymentDto } from './dto/payment.dto';
import * as crypto from 'crypto';
import { promises } from 'dns';


@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private PaymentModel: Model<Payment>,
    @InjectModel(Paymentref.name) private PaymentrefModel: Model<Paymentref>,
    private readonly AgentSrv: AgentService,) { }

  ////CRON_JOBS
  // 3- run cron jobs on 3 to see when they have expired and reset isSubscribed,CurrentSubscriptionid,CurrentPlanName
  // @Prop({ default: "BASIC" })
  // CurrentPlanName:string;

  // @Prop({ default: "basic" })
  // CurrentSubscriptionid:string;

  async createPayment(payload: CreatePaymentDto) {
    const agent = await this.AgentSrv.findAgentById(payload.agent_id)
    let plan
    if (payload.planNumber === 1) {
      plan = {
        name: "SILVER",
        Amount: 2500
      }
    } else if (payload.planNumber === 2) {
      plan = {
        name: "GOLD",
        Amount: 3500
      }
    } else if (payload.planNumber === 3) {
      plan = {
        name: "PLATINUM",
        Amount: 5000
      }
    } else {
      throw new ForbiddenException('invalid plan number was selected');
    }

    const paymentDetails = {
      email: agent.data.email,
      amount: plan.Amount * 100, //Convert to kobo or the appropriate currency
      metadata: {
        custom_fields: [
          {
            display_name: `Plan subscription`,
            variable_name: `${plan.name}`,
            value: `${plan.name}`,
          },
        ],
      }
    }

    try {
      const response = await httpPost("https://api.paystack.co/transaction/initialize", paymentDetails, {
        Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET_KEY}`,
      })
      console.log(response);
      console.log(response.data.reference);

      const Reference = {
        Agent_id: payload.agent_id,
        refrence_id: response.data.reference,
        planName: plan.name,
        amount: plan.amount,
        HowManyDaysPlan: payload.DurationOfPlan,
      };

      const ref = await new this.PaymentrefModel(Reference);
      await ref.save();
      return {
        paymentURL: response.data.authorization_url
      }

    } catch (error) {
      console.log(error)
    }

  }


  async verify(eventData, signature): Promise<boolean> {
    const hmac = crypto.createHmac('sha512', process.env.PAYSTACK_API_SECRET_KEY);
    const expectedSignature = hmac.update(JSON.stringify(eventData)).digest('hex');
    return expectedSignature === signature;
  }

  async webhook(eventData, signature) {
    if (!this.verify(eventData, signature)) {
      return { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid signature' };
    }
    console.log(eventData)

    if (eventData.event === 'charge.success') {
      const reference = eventData.data.reference;
      // Implement the logic to handle the successful charge event
      const paymentref = await this.PaymentrefModel.findOne({ refrence_id: reference }).exec();
      if (!paymentref) {
        throw new NotFoundException('Paymentref not found');
      }
      console.log(paymentref)
      await this.AgentSrv.getAndUpdateSubscriptionInfo(paymentref.Agent_id, true, paymentref.planName, paymentref.refrence_id)


      const Reference = {
        Agent_id: paymentref.Agent_id,
        subscriptionid: paymentref.refrence_id, // Autogenerated subscription ID
        planName: paymentref.planName,
        // amount: numberString,
        HowManyDaysPlan: paymentref.HowManyDaysPlan,
        DateOfExpiration: await this.addDaysToCurrentDate(paymentref.HowManyDaysPlan),
      };
      const ref = await new this.PaymentModel(Reference);
      await ref.save()

      return { statusCode: HttpStatus.OK, message: 'Webhook received and processed successfully' };
    }

    return { statusCode: HttpStatus.OK, message: 'Webhook received' };
  }


  async getPaymentBySubscriptionId(subscriptionId: string): Promise<Payment> {
    const payment = await this.PaymentModel.findOne({ subscriptionid: subscriptionId }).exec();
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async addDaysToCurrentDate(days: number): Promise<Date> {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate;
  }


}
