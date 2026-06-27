import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const admin = createAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const { data: capsulas } = await admin
    .from("capsulas")
    .select("id, nome, slug, user_id, profiles(email)")
    .eq("modalidade", "capsula_tempo")
    .eq("status", "fechada")
    .lte("data_abertura", new Date().toISOString());

  for (const capsula of capsulas ?? []) {
    await admin.from("capsulas").update({ status: "aberta" }).eq("id", capsula.id);

    const email = (capsula as unknown as { profiles: { email: string } | null }).profiles?.email;
    if (!email) continue;

    await resend.emails.send({
      from: "Cápsula do Tempo <onboarding@resend.dev>",
      to: email,
      subject: "Sua cápsula foi aberta! 🎉",
      html: `<p>Sua cápsula <strong>${capsula.nome}</strong> acabou de ser aberta.</p>
             <p><a href="${siteUrl}/dashboard/album/${capsula.slug}/completo">Ver memórias</a></p>`,
    });
  }

  return NextResponse.json({ ok: true, abertas: capsulas?.length ?? 0 });
}
