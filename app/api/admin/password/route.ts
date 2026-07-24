import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env.local");

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (token !== process.env.ADMIN_PASSWORD) return unauthorized();

  try {
    const { currentPassword, newPassword } = await request.json();

    if (currentPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ error: "New password must be at least 4 characters" }, { status: 400 });
    }

    // Read existing .env.local and replace ADMIN_PASSWORD line
    let envContent = "";
    try {
      envContent = fs.readFileSync(envPath, "utf-8");
    } catch {
      envContent = "";
    }

    if (envContent.includes("ADMIN_PASSWORD=")) {
      envContent = envContent.replace(
        /^ADMIN_PASSWORD=.*$/m,
        `ADMIN_PASSWORD=${newPassword}`
      );
    } else {
      envContent += `\nADMIN_PASSWORD=${newPassword}\n`;
    }

    fs.writeFileSync(envPath, envContent, "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
