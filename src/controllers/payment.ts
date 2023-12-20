import STATUS from "../constants/status-code";
import {
  createRazorpayOrder,
  retrieveRazorPayOrderDetails,
  retrieveRazorPayPaymentDetails,
  validateRazorpayPaymentOrder,
} from "../helpers/payment-channels/razorpay";
import { IInternDetails, InternPaymentStatus } from "../interfaces/intern";
import {
  ICreatePaymentOrder,
  IUpdatePaymentOrder,
  InitiatePaymentReq,
  PaymentGateways,
  PaymentOrderFor,
  PaymentStatus,
} from "../interfaces/payment-order";
import { Result } from "../interfaces/result";
import { updateInternById } from "../repositories/intern";
import {
  addPaymentOrder,
  retrievePaymentOrderDetailsById,
  updatePaymentOrderById,
} from "../repositories/payment-order";
import logger from "../utils/logger";
import { retrieveInternDetailsById } from "./intern";

export const initiatePayment = async (initiatePaymentReq: InitiatePaymentReq) => {
  try {
    const { payment_gateway, company_id, payment_order_for, amount, currency, order_for_id } = initiatePaymentReq;

    let createPaymentOrderReq: ICreatePaymentOrder = {
      company_id,
      payment_order_for,
      payment_gateway,
      payment_status: PaymentStatus.PENDING,
    };

    switch (payment_order_for) {
      case PaymentOrderFor.INTERNSHIP:
        createPaymentOrderReq.intern_id = order_for_id;
        break;

      case PaymentOrderFor.PRODUCT_PURCHASE:
        createPaymentOrderReq.customer_id = order_for_id;
        break;
    }

    const paymentOrderCreateRes = await addPaymentOrder(createPaymentOrderReq);

    if (paymentOrderCreateRes.isError()) {
      throw paymentOrderCreateRes.error;
    }

    const paymentOrderId = paymentOrderCreateRes.data;

    let paymentDetails: Result;

    switch (payment_gateway) {
      case PaymentGateways.RAZOR_PAY:
        {
          const razorpayOrderRes = await createRazorpayOrder({
            amount,
            currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
              order_id: paymentOrderId,
            },
          });

          if (razorpayOrderRes.isError()) {
            throw razorpayOrderRes.error;
          }

          paymentDetails = razorpayOrderRes;
        }
        break;

      case PaymentGateways.CASH_FREE:
        break;
    }

    return Result.ok(paymentDetails!.data);
  } catch (error) {
    logger.error(`at: "controllers/payment/initiatePayment" => ${JSON.stringify(error)} \n ${error}`);
    return Result.error(error);
  }
};

export const validateRazorpayPayment = async (
  orderId: string,
  paymentId: string,
  signature: string,
): Promise<Result<IInternDetails>> => {
  let paymentOrderId;

  try {
    const signatureValidation = await validateRazorpayPaymentOrder(orderId, paymentId, signature);

    if (!signatureValidation.data?.valid) {
      throw {
        statusCode: STATUS.NOT_FOUND,
        customMessage: "Invalid Payment Signature!",
      };
    }

    const razorpayPaymentOrderRes = await retrieveRazorPayOrderDetails(orderId);
    if (razorpayPaymentOrderRes.isError()) {
      throw razorpayPaymentOrderRes.error;
    }

    const paymentOrderId = razorpayPaymentOrderRes.data?.notes?.order_id as number;
    if (!paymentOrderId) {
      throw {
        statusCode: STATUS.BAD_REQUEST,
        customMessage: "Invalid request",
      };
    }

    const paymentDetailsRes = await retrieveRazorPayPaymentDetails(paymentId);
    if (paymentDetailsRes.isError()) {
      throw paymentDetailsRes.error;
    }

    const paymentDetails = paymentDetailsRes.data!;

    if (paymentDetails.status !== "captured") {
      throw {
        statusCode: STATUS.PAYMENT_REQUIRED,
        customMessage: "Payment not received",
      };
    }

    const payment_method = (razorPayPaymentMethodToEnum as any)[paymentDetails.method];

    const paymentOrderDetailsRes = await retrievePaymentOrderDetailsById(paymentOrderId);
    if (paymentOrderDetailsRes.isError()) {
      throw paymentOrderDetailsRes.error;
    }

    const paymentOrderUpdateDetails: IUpdatePaymentOrder = {
      payment_status: PaymentStatus.PAID,
      payment_gateway_response: JSON.stringify(paymentDetails),
      payment_method,
    };

    const updatePaymentOrderRes = await updatePaymentOrderById(paymentOrderId, paymentOrderUpdateDetails);
    if (updatePaymentOrderRes.isError()) {
      throw updatePaymentOrderRes.error;
    }

    const paymentOrderDetails = paymentOrderDetailsRes.data!;

    let result;

    if (paymentOrderDetails.intern_id) {
      // update intern payment status as paid
      const internPaymentStatusUpdateRes = await updateInternById(paymentOrderDetails.intern_id, {
        payment_status: InternPaymentStatus.PAID,
      });

      if (internPaymentStatusUpdateRes.isError()) {
        throw internPaymentStatusUpdateRes.error;
      }
      const internDetailsRes = await retrieveInternDetailsById(paymentOrderDetails.intern_id);
      result = internDetailsRes.data;
    }

    return Result.ok(result!);
  } catch (error) {
    if (paymentOrderId) {
      await updatePaymentOrderById(paymentOrderId, { payment_status: PaymentStatus.FAILED });
    }

    logger.error(`at : "controllers/payment/validateRazorpayPayment" => ${JSON.stringify(error)} \n ${error}`);

    return Result.error(error);
  }
};

const razorPayPaymentMethodToEnum = {
  card: "CARD",
  netbanking: "NET_BANKING",
  upi: "UPI",
};
