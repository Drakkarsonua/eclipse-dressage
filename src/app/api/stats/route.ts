import { NextRequest } from "next/server";
import { readData, writeData, checkAuth, unauthorized } from "@/lib/data";

export async function GET() {
  const data = readData("stats.json");
  return Response.json(data);
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();
  const body = await request.json();
  writeData("stats.json", body);
  return Response.json({ ok: true });
}
