export enum UserTypes {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
  INTERN = "INTERN",
  CUSTOMER = "CUSTOMER",
}

export interface ICreateUser {
  company_id: number;
  user_type: UserTypes;
  full_name: string;
  mobile_number: string;
  email?: string;
  password: string;
  dob?: Date;
}

export interface IUserDetails extends ICreateUser {
  user_id: number;
}

export interface IUpdateUserDetails {
  full_name?: string;
  mobile_number?: string;
  email?: string;
  password?: string;
  dob?: Date;
}

export interface IUserLoginRes {
  token: string;
  userDetails: Omit<IUserDetails, "password">;
  employee_id?: number;
}
