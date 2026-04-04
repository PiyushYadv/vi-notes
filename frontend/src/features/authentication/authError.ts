import axios from "axios";

export function getAuthErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) {
      return "We couldn't reach the server. Please make sure the backend is running.";
    }

    return error.response.data?.message || fallbackMessage;
  }

  if (error instanceof Error) return error.message;

  return fallbackMessage;
}
