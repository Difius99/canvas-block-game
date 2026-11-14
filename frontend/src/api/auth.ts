import { request, setToken } from "./client";

export type User = {
  username: string;
  bestScore: number;
};

type AuthResponse = {
  token: string;
  user: User;
};

export type Credentials = {
  username: string;
  password: string;
};

async function authenticate(path: string, credentials: Credentials): Promise<User> {
  const { token, user } = await request<AuthResponse>(path, {
    method: "POST",
    body: credentials,
  });
  setToken(token);
  return user;
}

export function register(credentials: Credentials): Promise<User> {
  return authenticate("/auth/register", credentials);
}

export function login(credentials: Credentials): Promise<User> {
  return authenticate("/auth/login", credentials);
}

export function fetchMe(): Promise<User> {
  return request<User>("/auth/me");
}

export function logout(): void {
  setToken(null);
}
