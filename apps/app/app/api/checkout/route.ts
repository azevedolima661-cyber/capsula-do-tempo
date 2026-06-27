import { NextResponse, type NextRequest } from "next/server";
import { Preference } from "mercadopago";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Informe seu e-mail." }, { status: 400 });
  }

  const admin = createAdminClient();
  await admin.from("payments").insert({ email, status: "pending", payment_type: "lifetime" });

  const preference = new Preference(getMercadoPagoClient());
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const result = await preference.create({
    body: {
      items: [
        {
          id: "capsula-do-tempo-lifetime",
          title: "Cápsula do Tempo — acesso vitalício",
          quantity: 1,
          unit_price: 37,
          currency_id: "BRL",
        },
      ],
      payer: { email },
      back_urls: {
        success: `${siteUrl}/cadastro?email=${encodeURIComponent(email)}`,
        pending: `${siteUrl}/`,
        failure: `${siteUrl}/`,
      },
      auto_return: "approved",
      notification_url: `${siteUrl}/api/webhooks/mercadopago`,
      external_reference: email,
    },
  });

  return NextResponse.json({ checkoutUrl: result.init_point });
}
