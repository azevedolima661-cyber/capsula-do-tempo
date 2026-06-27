import { NextResponse, type NextRequest } from "next/server";
import { Payment } from "mercadopago";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const paymentId = body?.data?.id;

  if (!paymentId) {
    return NextResponse.json({ ok: true });
  }

  const payment = new Payment(getMercadoPagoClient());
  const result = await payment.get({ id: paymentId });

  if (result.status !== "approved") {
    return NextResponse.json({ ok: true });
  }

  const email = result.payer?.email ?? result.external_reference;
  if (!email) {
    return NextResponse.json({ ok: true });
  }

  const admin = createAdminClient();
  await admin
    .from("payments")
    .update({ status: "paid" })
    .eq("email", email)
    .eq("status", "pending")
    .is("user_id", null);

  return NextResponse.json({ ok: true });
}
