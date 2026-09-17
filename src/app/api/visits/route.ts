import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "analytics" },
    });

    let visits = 1;
    if (record && record.value && typeof record.value === "object") {
      const val = record.value as any;
      if (val.website_visits !== undefined) {
        visits = (Number(val.website_visits) || 0) + 1;
      }
    }

    await prisma.setting.upsert({
      where: { key: "analytics" },
      update: { value: { website_visits: visits } },
      create: { key: "analytics", value: { website_visits: visits } },
    });

    return NextResponse.json({ success: true, visits });
  } catch (err: any) {
    console.error("Visits count increment failed:", err);
    return NextResponse.json({ error: err.message || "Failed to increment visits" }, { status: 500 });
  }
}

