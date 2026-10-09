import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { currentUser } from "@/lib/auth";
import { UPLOAD_DIR, newId } from "@/lib/db";

const EXT: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif" };
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const user = await currentUser();
  if (user?.role !== "admin") return Response.json({ error: "Not allowed" }, { status: 403 });

  const form = await req.formData();
  const urls: string[] = [];
  for (const entry of form.getAll("files")) {
    if (!(entry instanceof File)) continue;
    const ext = EXT[entry.type];
    if (!ext) return Response.json({ error: `${entry.name}: only JPG, PNG, WebP or AVIF images` }, { status: 400 });
    if (entry.size > MAX_BYTES) return Response.json({ error: `${entry.name}: larger than 8 MB` }, { status: 400 });
    const name = newId("img") + ext;
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await entry.arrayBuffer()));
    urls.push(`/uploads/${name}`);
  }
  return Response.json({ urls });
}
