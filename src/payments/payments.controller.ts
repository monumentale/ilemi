import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, HttpStatus, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Payment } from './schema/payments.schema';
@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }


  @Post("/make-payment")
  @ApiOperation({ summary: 'Create Payment' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Payment created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiForbiddenResponse({ description: 'Invalid plan number selected' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<any> {
    try {
      const result = await this.paymentsService.createPayment(createPaymentDto);
      return result;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }


  @Post('/webhook')
  async handleWebhook(@Body() eventData: any, @Headers('x-paystack-signature') signature: string): Promise<any> {
    this.paymentsService.webhook(eventData, signature)
  }

  @Get(':subscriptionId')
  @ApiOperation({ summary: 'Get payment by subscription ID' })
  @ApiParam({ name: 'subscriptionId', description: 'Subscription ID of the payment' })
  @ApiOkResponse({ description: 'Payment details', type: Payment })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  async getPaymentBySubscriptionId(@Param('subscriptionId') subscriptionId: string) {
    try {
      const payment = await this.paymentsService.getPaymentBySubscriptionId(subscriptionId);
      return payment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
