import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const session = cookies().get("session")?.value;

  console.log("Session Cookie:", session);

  if (!session) {
    console.log("No session found");
    return NextResponse.json({ user: null });
  }

  const user = JSON.parse(session);

  console.log("User Data:", user);

  return NextResponse.json({ user });
}

