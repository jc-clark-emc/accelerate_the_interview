import { NextRequest, NextResponse } from "next/server";
import { validateActivationCode, getTierName } from "@/lib/activation";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Activation code is required" },
        { status: 400 }
      );
    }

    const tier = validateActivationCode(code);

    if (!tier) {
      return NextResponse.json(
        { error: "Invalid activation code. Please check your PDF and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      tier,
      tierName: getTierName(tier),
    });
  } catch (error: any) {
    console.error("Validate code error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
