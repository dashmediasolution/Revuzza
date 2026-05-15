// app/api/razorpay/verify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 🔐 1. Auth check
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const companyId = session.user.companyId;

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "Business account required" },
        { status: 403 }
      );
    }

    // 📦 2. Get body
    const bodyData = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planType,
      amount,
    } = bodyData;

    // 🛑 Basic validation
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { success: false, error: "Missing payment data" },
        { status: 400 }
      );
    }

    // 🔐 3. Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    // 🧠 4. Normalize plan (VERY IMPORTANT for Prisma enum)
    const normalizedPlan = planType.toUpperCase();

    // 💾 5. Save payment
    await prisma.payment.create({
      data: {
        companyId: companyId,
        amount: Number(amount),
        status: "COMPLETED",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        planType: normalizedPlan,
        billingCycle: "MONTHLY",
        paymentMethod: "RAZORPAY",
      },
    });

    // 🚀 6. Update company plan
    await prisma.company.update({
      where: { id: companyId },
      data: { plan: normalizedPlan },
    });

    // ✅ 7. Success response
    return NextResponse.json({
      success: true,
      message: "Payment verified and plan updated",
    });

  } catch (error) {
    console.error("Razorpay Verify Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}