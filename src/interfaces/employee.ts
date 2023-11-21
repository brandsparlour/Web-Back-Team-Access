import { UserTypes } from "./user";

export interface IStoreEmployeeDetails {
  company_id: number;
  user_id: number;
  role_id: number;
  profile_image?: string;
  address?: string;
  reporting_to?: number;
  locations_responsible?: string;
}

export interface IStoredEmployeeDetails extends IStoreEmployeeDetails {
  employee_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateEmployeeReq {
  company_id: number;
  role_id: number;
  full_name: string;
  mobile_number: string;
  email?: string;
  password: string;
  dob?: Date;
  profile_image?: string;
  address?: string;
  reporting_to?: number;
  locations_responsible?: string;
}

export interface IEmployeeDetails extends ICreateEmployeeReq {
  employee_id: number;
  user_type: UserTypes;
  created_at: Date;
  updated_at: Date;
}

export interface IStoreEmployeeResult {
  employee_id: number;
}

// user_type: "Admin" | "Customer";
// role?:
//   | "Manager"
//   | "Employee"
//   | "HR"
//   | "Market Manager"
//   | "Intern (Event Organizer)"
//   | "Intern (Social Influencer)"
//   | "Affiliate";
