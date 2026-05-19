import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { logger } from "../../../logger";

export async function POST(req: Request) {
  try {
    const { planType } = await req.json();

    await logger.info("Received plan", planType);

    // planType is full object
    const plan = planType;

    // choose monthly price
    const amount = plan.price.monthly * 100;

    if (!amount) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    } 
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!,
    });
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    await logger.info("Created Razorpay order", order);
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
    });

  } catch (error) {
    await logger.error("Failed to create order", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}