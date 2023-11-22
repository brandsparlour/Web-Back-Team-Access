import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/status-code";
import * as paymentController from "../controllers/payment";
import { PaymentGateways, PaymentOrderFor } from "../interfaces/payment-order";
import { Result } from "../interfaces/result";
import { CustomError } from "../middlewares/error";

const router = express.Router();

router.post("/create-order", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payment_gateway, company_id, payment_order_for, amount, currency, order_for_id } = req.body;

    if (!payment_gateway || !company_id || !payment_order_for || !amount || !currency || !order_for_id) {
      // Throw an error if any parameter is not provided
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage:
          "payment_gateway, company_id, payment_order_for, amount, currency  and order_for_id are required",
      };

      throw err;
    }

    if (!Object.keys(PaymentGateways).includes(payment_gateway)) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid payment gateway",
      };
    }

    if (!Object.keys(PaymentOrderFor).includes(payment_order_for)) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid payment order for value",
      };
    }

    const initiatePaymentDetails = {
      payment_gateway,
      company_id,
      payment_order_for,
      amount,
      currency,
      order_for_id,
    };

    const result: Result = await paymentController.initiatePayment(initiatePaymentDetails);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Successfully created payment order",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/razorpay/validate", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      const err: CustomError = {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid request.",
      };

      throw err;
    }

    const result: Result = await paymentController.validateRazorpayPayment(orderId, paymentId, signature);
    if (result.isError()) {
      throw result.error;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Payment Successful",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
