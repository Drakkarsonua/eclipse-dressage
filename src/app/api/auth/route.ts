import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const expected = process.env.ADMIN_PASSWORD;
  if (expected && typeof password === "string" && password === expected) {
    return Response.json({ ok: true });
  }
  return Response.json({ error: "Wrong password" }, { status: 401 });
}
