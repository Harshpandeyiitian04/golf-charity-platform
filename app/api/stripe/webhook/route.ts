import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const { userId, plan } = session.metadata;

    const endDate =
      plan === "yearly"
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    await supabaseAdmin
      .from("profiles")
      .update({
        subscription_status: "active",
        subscription_plan: plan,
        subscription_id: session.subscription,
        subscription_end_date: endDate.toISOString(),
      })
      .eq("id", userId);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as any;
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    await supabaseAdmin
      .from("profiles")
      .update({ subscription_status: "inactive" })
      .eq("subscription_id", subscription.id);
  }

  return NextResponse.json({ received: true });
}
