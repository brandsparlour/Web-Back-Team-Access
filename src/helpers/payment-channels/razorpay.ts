import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import Razorpay from "razorpay";
import { Orders } from "razorpay/dist/types/orders";
import { Payments } from "razorpay/dist/types/payments";
import { IPaymentDetails } from "../../interfaces/payment-order";
import { Result } from "../../interfaces/result";
import logger from "../../utils/logger";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

// Create an instance of Razorpay
function createRazorpayInstance() {
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

function verifySignature(orderId: string, paymentId: string, signature: string, secretKey: string) {
  const generatedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(orderId + "|" + paymentId)
    .digest("hex");
  return generatedSignature === signature;
}

// Create Razorpay order
export const createRazorpayOrder = async (
  paymentDetails: IPaymentDetails,
): Promise<Result<{ order: Orders.RazorpayOrder }>> => {
  const razorpay = createRazorpayInstance();

  const options = {
    amount: paymentDetails.amount * 100, // Razorpay accepts amount in the smallest currency unit (like paise for INR)
    currency: paymentDetails.currency,
    receipt: `receipt_${Date.now()}`, // Generate a unique receipt identifier
    payment_capture: "1", // Auto capture the payment
    notes: paymentDetails.notes,
  };

  try {
    const order = await razorpay.orders.create(options);
    return Result.ok({ order });
  } catch (error) {
    logger.error(`at: helpers/payment-channels/razorpay/createRazorpayOrder => ${JSON.stringify(error)} \n ${error}`);

    return Result.error({
      customMessage: "Error creating payment with Razorpay.",
    });
  }
};

// Validate Razorpay payment
export const validateRazorpayPaymentOrder = async (order_id: string, payment_id: string, signature: string) => {
  const razorpay = createRazorpayInstance();

  const isValidSignature = verifySignature(order_id, payment_id, signature, RAZORPAY_KEY_SECRET);

  if (isValidSignature) {
    return Result.ok({ valid: true });
  } else {
    return Result.ok({ valid: false });
  }
};

export const retrieveRazorPayOrderDetails = async (order_id: string): Promise<Result<Orders.RazorpayOrder>> => {
  try {
    const razorpay = createRazorpayInstance();

    const result = await razorpay.orders.fetch(order_id);

    return Result.ok(result);
  } catch (error) {
    logger.error(
      `at: "helpers/payment-channels/razorpay/retrieveRazorPayOrderDetails" => ${JSON.stringify(error)} \n ${error}`,
    );
    return Result.error(error);
  }
};

export const retrieveRazorPayPaymentDetails = async (paymentId: string): Promise<Result<Payments.RazorpayPayment>> => {
  try {
    const razorpay = createRazorpayInstance();

    const result = await razorpay.payments.fetch(paymentId);

    return Result.ok(result);
  } catch (error) {
    logger.error(
      `at: "helpers/payment-channels/razorpay/retrieveRazorPayPaymentDetails" => ${JSON.stringify(error)} \n ${error}`,
    );
    return Result.error(error);
  }
};
