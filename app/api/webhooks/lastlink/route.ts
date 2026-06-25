import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

// A documentação oficial da Lastlink bloqueou acesso automatizado (403) no
// momento em que isso foi escrito, então o formato exato do payload não pôde
// ser confirmado linha a linha. A extração abaixo é defensiva (tenta alguns
// caminhos comuns) — confirme com um "enviar teste" no painel da Lastlink e
// ajuste os caminhos se o campo certo estiver em outro lugar.
function extractBuyer(body: any): { email: string | null; name: string | null } {
  const buyer = body?.Data?.Buyer ?? body?.data?.buyer ?? body?.Buyer ?? body?.buyer ?? {};
  const email = buyer?.Email ?? buyer?.email ?? null;
  const name = buyer?.Name ?? buyer?.name ?? null;
  return { email, name };
}

function isPurchaseConfirmed(body: any): boolean {
  const event = body?.Event ?? body?.event ?? "";
  return event === "Purchase_Order_Confirmed";
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret") ?? request.headers.get("x-webhook-secret");
  if (secret !== process.env.LASTLINK_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();

  if (!isPurchaseConfirmed(body)) {
    return NextResponse.json({ ignorado: true });
  }

  const { email, name } = extractBuyer(body);
  if (!email) {
    return NextResponse.json({ error: "E-mail do comprador não encontrado no payload" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${siteUrl}/app` },
  });

  if (linkError || !linkData.user) {
    return NextResponse.json({ error: linkError?.message ?? "Não foi possível gerar o acesso" }, { status: 500 });
  }

  await supabase.from("profiles").upsert({ id: linkData.user.id, name, email });

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Cápsula do Tempo <contato@capsuladotempo.com>",
      to: email,
      subject: "Seu acesso à sua Cápsula do Tempo",
      html: `<p>Olá${name ? `, ${name}` : ""}!</p><p>Sua compra foi confirmada. Clique no link abaixo para acessar e começar a montar sua cápsula do tempo:</p><p><a href="${linkData.properties.action_link}">Acessar minha cápsula</a></p>`,
    });
  }

  return NextResponse.json({ ok: true });
}
