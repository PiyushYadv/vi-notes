import type { LoginInput, SignupInput, User } from "../contexts/AuthContext";

let fakeUser: User | null = null;
const MOCK_API_DELAY_MS = 600;

function wait(ms = MOCK_API_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fakeLogin({
  email,
}: LoginInput): Promise<User> {
  await wait();

  fakeUser = {
    id: fakeUser?.id ?? crypto.randomUUID(),
    name: fakeUser?.name ?? "Guest",
    email,
  };

  return fakeUser;
}

export async function fakeSignup(data: SignupInput): Promise<User> {
  await wait();

  fakeUser = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
  };

  return fakeUser;
}

export async function fakeGetUser() {
  await wait();
  return fakeUser;
}

export async function fakeLogout() {
  await wait(300);
  fakeUser = null;
}
