import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const contentPath = path.join(process.cwd(), "data", "content.json");

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (token !== process.env.ADMIN_PASSWORD) return unauthorized();

  try {
    const body = await request.json();
    fs.writeFileSync(contentPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
