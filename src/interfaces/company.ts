export interface ICreateCompany {
  company_name: string;
  address: string;
  contact: string;
  created_at?: string;
  updated_at?: string;
}

export interface ICompanyDetails extends ICreateCompany {
  company_id: number;
}

export interface IUpdateCompany {
  company_id: number;
  company_name: string;
  address: string;
  contact: string;
}
