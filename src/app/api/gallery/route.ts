import { NextRequest } from "next/server";
import { readData, writeData, checkAuth, unauthorized } from "@/lib/data";

export interface GalleryPhoto {
  image: string;
  caption: string;
}

export async function GET() {
  const data = readData<GalleryPhoto[]>("gallery.json");
  return Response.json(data);
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const body = await request.json();
  writeData("gallery.json", body);
  return Response.json({ ok: true });
}
