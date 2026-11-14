const API_URL = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "block-blast:token";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // хранилище недоступно — токен проживёт только до перезагрузки
  }
}

type ErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

// бэкенд отвечает { message } или ValidationProblemDetails с полем errors
function readErrorMessage(body: ErrorBody | null, status: number): string {
  if (body?.message) return body.message;
  const firstError = body?.errors && Object.values(body.errors)[0]?.[0];
  if (firstError) return firstError;
  if (status === 401) return "Нужно войти заново";
  return "Сервер недоступен, попробуйте позже";
}

export async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(0, "Сервер недоступен, попробуйте позже");
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, readErrorMessage(body, response.status));
  }
  return body as T;
}
