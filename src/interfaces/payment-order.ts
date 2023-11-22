export enum PaymentGateways {
  RAZOR_PAY = "RAZOR_PAY",
  CASH_FREE = "CASH_FREE",
}

export enum PaymentOrderFor {
  INTERNSHIP = "INTERNSHIP",
  EVENT_PARTICIPATION = "EVENT_PARTICIPATION",
  EVENT_SPONSORSHIP = "EVENT_SPONSORSHIP",
  PROMOTION = "PROMOTION",
  PRODUCT_PURCHASE = "PRODUCT_PURCHASE",
}

export enum PaymentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PayeeType {
  EMPLOYEE = "EMPLOYEE",
  INTERN = "INTERN",
  CUSTOMER = "CUSTOMER",
}

export enum PaymentMethods {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  NET_BANKING = "NET_BANKING",
  UPI = "UPI",
}

export interface InitiatePaymentReq {
  company_id: number;
  payment_order_for: PaymentOrderFor;
  payment_gateway: PaymentGateways;
  amount: number;
  currency: string;
  order_for_id: number;
}

export interface IPaymentDetails {
  amount: number;
  currency: string;
  receipt: string;
  notes?: any;
}

export interface ICreatePaymentOrder {
  company_id: number;
  payment_order_for: PaymentOrderFor;
  payment_gateway: PaymentGateways;
  payment_method?: PaymentMethods;
  transaction_id?: string;
  payment_status: PaymentStatus;
  payee_type?: PayeeType;
  employee_id?: number;
  intern_id?: number;
  customer_id?: number;
  billing_details?: string;
  payment_gateway_response?: string;
}

export interface IPaymentOrderDetails extends ICreatePaymentOrder {
  order_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IUpdatePaymentOrder {
  transaction_id?: string;
  payment_status?: PaymentStatus;
  payment_gateway_response?: string;
  payment_method?: PaymentMethods;
}
