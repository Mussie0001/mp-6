import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

export async function GET(request: Request) {
  const url = new URL(request.url);

  if (url.pathname === "/api/auth/login") {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile%20openid`;
    return NextResponse.redirect(authUrl);
  }

  if (url.pathname === "/api/auth/callback") {
    const code = url.searchParams.get("code");
    if (!code) {
      console.log("No code found");
      return NextResponse.json({ error: "No code found" });
    }
  
    // Log token request payload
    const payload = {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    };
    console.log("Token Request Payload:", payload);
  
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    const tokenData = await tokenResponse.json();
  
    console.log("Token Response:", tokenData);
  
    if (tokenData.error) {
      console.error("Error fetching token:", tokenData);
      return NextResponse.json({ error: tokenData.error, description: tokenData.error_description });
    }
  
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
  
    const userInfo = await userInfoResponse.json();
  
    console.log("User Info Response:", userInfo);
  
    if (userInfo.error) {
      console.error("Error fetching user info:", userInfo);
      return NextResponse.json({ error: userInfo.error, description: userInfo.error_description });
    }
  
    cookies().set("session", JSON.stringify(userInfo), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });
  
    return NextResponse.redirect(new URL("/user", request.url).toString());
  }
  

  return NextResponse.json({ error: "Unsupported route" });
}