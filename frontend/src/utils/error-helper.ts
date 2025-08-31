import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";

export function extractErrorMessage(error: unknown): string {
  if (!error) return "Unknown error";

  if ((error as AxiosError<ApiError>).isAxiosError) {
    const axiosError = error as AxiosError<ApiError>;
    const data = axiosError.response?.data;

    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message.join(", ");
      }
      return data.message;
    }
  }

  if (error instanceof Error) return error.message;

  return "Unexpected error";
}
