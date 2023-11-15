export interface ICreateInternAffiliateLink {
  company_id: number;
  created_by: number;
  job_details: string;
  link: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IInternAffiliateLinkDetails extends ICreateInternAffiliateLink {
  link_id: number;
}

export interface IUpdateInternAffiliateLink {
  job_details: string;
  link: string;
  company_id: number;
  link_id: number;
}