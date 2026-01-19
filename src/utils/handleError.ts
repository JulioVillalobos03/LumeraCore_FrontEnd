import { AxiosError } from "axios";

interface BackendError {
  message?: string;
}

export function resolveErrorKey(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return "errors.NETWORK";
    }

    const data = error.response.data as BackendError;

    // 🔑 AQUÍ ESTÁ LA CLAVE
    if (data?.message) {
      return `errors.${data.message}`;
    }
  }

  return "errors.GENERIC";
}
