import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const session = cookies().get("session")?.value;
  if (!session) return NextResponse.json({ user: null });

  const user = JSON.parse(session);
  return NextResponse.json({ user });
}
