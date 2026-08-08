import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ 
      success: true, 
      message: "Social account linked",
      data: body 
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
