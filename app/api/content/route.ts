import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const contentPath = path.join(process.cwd(), "data", "content.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(contentPath, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}
