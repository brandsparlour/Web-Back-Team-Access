export enum InternshipPaymentType {
  PAID = "PAID",
  FREE = "FREE",
}

export interface ICreateInternship {
  company_id: number;
  name: string;
  description: string;
  payment_type: InternshipPaymentType;
  registration_fee: number;
}

export interface IInternshipDetails extends ICreateInternship {
  internship_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IUpdateInternship {
  name?: string;
  description?: string;
  payment_type?: InternshipPaymentType;
  registration_fee?: number;
}
