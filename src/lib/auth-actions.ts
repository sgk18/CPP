"use server";

import * as auth from "./auth";

export async function loginAction(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await auth.login(password);
    if (success) {
      return { success: true };
    }
    return { success: false, error: "Invalid admin password" };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    await auth.logout();
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function checkAuthAction(): Promise<boolean> {
  return await auth.verifySession();
}
