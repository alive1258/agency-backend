import { Controller, Post, Body, Req, UseGuards, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import type { Request, Response } from 'express';
import { JwtOrApiKeyGuard } from '../../../auth/guards/jwt-or-api-key.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('init')
  @UseGuards(JwtOrApiKeyGuard)
  initPayment(@Req() req: Request, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(req, createPaymentDto);
  }

  @Post('success')
  async success(@Body() body: any, @Res() res: Response) {
    const result = await this.paymentsService.handleSuccess(body);
    // redirect frontend with query params
    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/result?tran_id=${body.tran_id}&status=success`,
    );
  }

  @Post('fail')
  async fail(@Body() body: any, @Res() res: Response) {
    const result = await this.paymentsService.handleFail(body);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/result?tran_id=${body.tran_id}&status=fail`,
    );
  }

  @Post('cancel')
  async cancel(@Body() body: any, @Res() res: Response) {
    const result = await this.paymentsService.handleCancel(body);

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/result?tran_id=${body.tran_id}&status=cancel`,
    );
  }
}
