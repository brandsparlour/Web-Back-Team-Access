export enum CustomerTypes {
    EVENT_SPONSORSHIP = "event sponsorship(promote my business)",
    PRODUCT_PURCHASE = "product purchase",
    PLAN_PURCHASE = "plan purchase"
}

export interface IStoreCustomerDetails {
    company_id: number;
    user_id: number;
    type: CustomerTypes;
    profile_image?: string;
    address?: string;
  }
  
  export interface IStoredCustomerDetails extends IStoreCustomerDetails {
    customer_id: number;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ICreateCustomerReq extends Omit<IStoreCustomerDetails, "user_id"> {
    full_name: string;
    mobile_number: string;
    password: string;
    email?: string;
    dob?: Date;
  }
  
  export interface ICustomerDetails extends IStoredCustomerDetails {
    full_name: string;
    mobile_number: string;
    password: string;
    email?: string;
    dob?: Date;
  }
  
  export interface IUpdateCustomer {
    type: CustomerTypes;
    profile_image?: string;
    address?: string;
  }
  