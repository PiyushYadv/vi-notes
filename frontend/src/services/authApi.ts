import axios from "axios";
import type { LoginInput, SignupInput } from "../contexts/AuthContext";
import type { User } from "../contexts/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // VERY IMPORTANT
});

type AuthResponse = {
  status: string;
  message?: string;
  token?: string;
  data?: {
    user?: User;
    data?: User;
  };
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
  passwordConfirm: string;
};

export const loginApi = async ({ email, password }: LoginInput) => {
  const { data } = await api.post<AuthResponse>("/login", { email, password });
  return data.data?.user ?? null;
};

export const signupApi = async ({ name, email, password }: SignupInput) => {
  const { data } = await api.post<AuthResponse>("/signup", {
    name,
    email,
    password,
  });
  return data.data?.user ?? null;
};

export const logoutApi = async () => {
  await api.post("/logout");
};

export const getMeApi = async () => {
  const { data } = await api.get<AuthResponse>("/me");
  return data.data?.data ?? null;
};

export const forgotPasswordApi = async ({ email }: ForgotPasswordInput) => {
  const { data } = await api.post<AuthResponse>("/forgotPassword", { email });
  return data.message ?? "If that account exists, a reset link has been sent.";
};

export const resetPasswordApi = async ({
  token,
  password,
  passwordConfirm,
}: ResetPasswordInput) => {
  const { data } = await api.patch<AuthResponse>(`/resetPassword/${token}`, {
    password,
    passwordConfirm,
  });

  return data.data?.user ?? null;
};
