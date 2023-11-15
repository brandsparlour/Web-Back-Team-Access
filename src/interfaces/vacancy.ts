export interface ICreateVacancy {
  job_id: number;
  number_of_positions: number;
  status: "Open" | "Closed";
  created_at?: string;
  updated_at?: string;
}

export interface IVacancyDetails extends ICreateVacancy {
  vacancy_id: number;
}

export interface IUpdateVacancy {
  jobId: number;
  numberOfPositions: number;
  status: "Open" | "Closed";
  vacancyId: number;
}
