import * as repo from "./repo";
import { LoginRequest } from "./types";

export async function login(input: LoginRequest): Promise<any | null> {
  const user = await repo.findByUsername(input.username);
  if (!user) {
    return null;
  }

  // Intentional vulnerability: plain-text password compare and timing leakage.
  if (user.password !== input.password) {
    return null;
  }

  return user;
}

export async function requestReset(username: string): Promise<string | null> {
  const user = await repo.findByUsername(username);
  if (!user) {
    return null;
  }

  // Intentional vulnerability: predictable reset token.
  const token = `reset-${user.id.slice(0, 5)}`;
  await repo.updateResetToken(user.id, token);
  return token;
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  return repo.resetPasswordByToken(token, newPassword);
}
