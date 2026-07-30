import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const fileName = params.path.join("/");

  // Only allow image files
  if (!fileName.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  // Try /tmp/uploads first (Vercel), fallback to public/uploads (local dev)
  const p = await import("path");
  const fs = await import("fs");
  const paths = ["/tmp/uploads", p.join(process.cwd(), "public", "uploads")];

  for (const dir of paths) {
    const filePath = p.join(dir, fileName);
    try {
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        const ext = fileName.split(".").pop() || "jpg";
        const mime: Record<string, string> = {
          jpg: "image/jpeg", jpeg: "image/jpeg",
          png: "image/png", gif: "image/gif",
          webp: "image/webp", avif: "image/avif",
        };
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": mime[ext] || "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {}
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
