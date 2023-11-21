export interface ICreateRole {
  company_id: number;
  designation: string;
}

export interface IRoleDetails extends ICreateRole {
  role_id: number;
}

export interface IUpdateRole {
  designation: string;
}
