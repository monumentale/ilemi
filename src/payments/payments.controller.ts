import { Controller, Get, Post, Body, Patch, Param, Delete,Headers, HttpStatus, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
