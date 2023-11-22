export interface ICreateInternAffiliateLink {
  company_id: number;
  created_by: number;
  job_details: string;
  link: string;
  is_active?: boolean;
}

export interface IInternAffiliateLinkDetails extends ICreateInternAffiliateLink {
  link_id: number;
  created_at: string;
  updated_at: string;
}

export interface IUpdateInternAffiliateLink {
  job_details: string;
  link: string;
  is_active: boolean;
}
