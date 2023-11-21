export interface ICreateCompany {
  company_name: string;
  address: string;
  contact: string;
  logo?: string;
  privacy_policy?: string;
  terms_and_conditions?: string;
}

export interface ICompanyDetails extends ICreateCompany {
  company_id: number;
  created_at: Date;
  updated_at?: Date;
}

export interface IUpdateCompany {
  company_name?: string;
  address?: string;
  contact?: string;
  logo?: string;
  privacy_policy?: string;
  terms_and_conditions?: string;
}
