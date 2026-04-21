// app/api/razorpay/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    companyId,
    planType,
    amount 
  } = await req.json();

  // 1. Verify Signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 2. Save to your existing Payment Schema
  await prisma.payment.create({
    data: {
      companyId,
      amount: parseFloat(amount),
      status: "COMPLETED", // Admin will look for this
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      planType: planType,
      billingCycle: "MONTHLY", // or "ANNUAL"
      paymentMethod: "RAZORPAY",
    },
  });

  return NextResponse.json({ message: "Payment verified and logged" });
}