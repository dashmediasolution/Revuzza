import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {



  const body = await req.text(); // ⚠️ raw body required

  const signature = req.headers.get("x-razorpay-signature")!;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ status: "invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  // 🎯 Handle events   
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;


    
    // 👉 Update DB here (safer than frontend)
  }

  return NextResponse.json({ status: "ok" });
}