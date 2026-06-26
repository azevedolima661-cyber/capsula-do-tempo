import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: capsules, error } = await supabase
    .from("capsules")
    .select("id, title, owner_id")
    .eq("status", "fechada")
    .lte("open_date", today);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!capsules || capsules.length === 0) {
    return NextResponse.json({ aberta: 0 });
  }

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  for (const capsule of capsules) {
    await supabase
      .from("capsules")
      .update({ status: "aberta", notified_at: new Date().toISOString() })
      .eq("id", capsule.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("email, name")
      .eq("id", capsule.owner_id)
      .single();

    if (resend && profile?.email) {
      await resend.emails.send({
        from: "Cápsula do Tempo <contato@capsuladotempo.com>",
        to: profile.email,
        subject: `Sua cápsula "${capsule.title}" foi aberta!`,
        html: `<p>Olá${profile.name ? `, ${profile.name}` : ""}!</p><p>Chegou o dia: sua cápsula <strong>${capsule.title}</strong> foi aberta. Entre na sua conta para reviver tudo o que foi guardado.</p>`,
      });
    }
  }

  return NextResponse.json({ aberta: capsules.length });
}
