export interface ICreateJob {
  job_title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  employment_type: "Full-time" | "Part-time" | "Contract";
  job_category?: string;
  application_deadline?: string;
  experience_level?: string;
  education?: string;
  contact_email?: string;
  posted_date?: string;
  application_url?: string;
}

export interface IJobDetails extends ICreateJob {
  job_id: number;
}
