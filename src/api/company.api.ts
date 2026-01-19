import { api } from "./axios";

export interface CreateCompanyResponse {
    ok: boolean;
    company: {
        id: string;
        name: string;
    };
}


export async function createCompany(name: string) {
    const { data } = await api.post<CreateCompanyResponse>("/companies", { name });
    return data;
}