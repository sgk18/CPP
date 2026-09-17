import { NextResponse } from "next/server";
import { storageService } from "@/lib/storage";
import { verifySession } from "@/lib/auth";

export async function POST(request: Request) {
  const isAuth = await verifySession();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await storageService.upload(buffer, file.name, file.type, folder);

    return NextResponse.json({ success: true, metadata });
  } catch (error: any) {
    console.error("File upload API error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
