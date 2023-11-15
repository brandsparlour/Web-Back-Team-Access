export interface ICreateUser {
  company_id: number;
  user_type: "Admin" | "Customer";
  role?:
    | "Manager"
    | "Employee"
    | "HR"
    | "Market Manager"
    | "Intern (Event Organizer)"
    | "Intern (Social Influencer)"
    | "Affiliate";
  full_name: string;
  mobile_number?: string;
  email: string;
  password: string;
  dob?: string;
  profile_image?: string;
  address?: string;
  reporting_to?: number; 
  locations_responsible?: string; 
  created_at?: string; 
  updated_at?: string;
}

export interface IStoredUser extends ICreateUser {
  user_id: number;
}

export interface IStoreUserResult {
  id: number;
}
