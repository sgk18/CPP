"use server";

import { prisma } from "@/lib/prisma";
import { logActivity } from "./logs";

export async function getSettingsAction(key: string) {
  try {
    const record = await prisma.setting.findUnique({
      where: { key },
    });
    return { success: true, record };
  } catch (err: any) {
    console.error(`Error fetching settings for ${key}:`, err);
    return { success: false, error: err.message || `Failed to fetch setting ${key}` };
  }
}

export async function saveSettingsAction(key: string, value: any) {
  try {
    const record = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    await logActivity(`Settings updated: ${key}`, "setting", key);
    return { success: true, record };
  } catch (err: any) {
    console.error(`Error saving settings for ${key}:`, err);
    return { success: false, error: err.message || `Failed to save setting ${key}` };
  }
}
