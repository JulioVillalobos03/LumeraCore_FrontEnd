export type CompanyUserStatus = "active" | "inactive";


export interface CompanyUser {
  company_user_id: string;
  user_id: string;
  name: string;
  email: string;
  status: CompanyUserStatus;
  role_name?: string;
}


export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleId: string;
}