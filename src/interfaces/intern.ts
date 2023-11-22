export enum InternTypes {
  ORGANIZER = "ORGANIZER",
  INFLUENCER = "INFLUENCER",
}

export enum InternPaymentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
}

export interface IStoreInternDetails {
  company_id: number;
  user_id: number;
  internship_id: number;
  link_id?: number;
  referred_by?: number;
  intern_type: InternTypes;
  course?: string;
  year?: number;
  college?: string;
  university?: string;
  photo?: string;
  identity_card?: string;
  payment_status: InternPaymentStatus;
}

export interface IStoredInternDetails extends IStoreInternDetails {
  intern_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateInternReq extends Omit<IStoreInternDetails, "user_id" | "payment_status"> {
  full_name: string;
  mobile_number: string;
  password: string;
  email?: string;
  dob?: Date;
}

export interface IInternDetails extends IStoredInternDetails {
  full_name: string;
  mobile_number: string;
  password: string;
  email?: string;
  dob?: Date;
}

export interface IUpdateIntern {
  course?: string;
  year?: number;
  college?: string;
  university?: string;
  photo?: string;
  identity_card?: string;
  payment_status?: InternPaymentStatus;
}
