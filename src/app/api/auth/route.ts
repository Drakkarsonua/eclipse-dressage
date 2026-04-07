import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (password === process.env.ADMIN_PASSWORD) {
    return Response.json({ ok: true });
  }
  return Response.json({ error: "Wrong password" }, { status: 401 });
}
