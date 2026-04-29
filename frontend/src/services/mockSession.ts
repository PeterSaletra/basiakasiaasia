import { MOCK_SESSION_USER_STORAGE_KEY } from "@/config/storage";

export type SessionRole = "admin" | "user";

export type SessionUser = {
  user_id: number;
  username: string;
  email: string;
  role: SessionRole;
};

export function readMockSessionUser(): SessionUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.sessionStorage.getItem(MOCK_SESSION_USER_STORAGE_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as SessionUser;
  } catch {
    return null;
  }
}

export function writeMockSessionUser(user: SessionUser | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (user === null) {
    window.sessionStorage.removeItem(MOCK_SESSION_USER_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(MOCK_SESSION_USER_STORAGE_KEY, JSON.stringify(user));
}
