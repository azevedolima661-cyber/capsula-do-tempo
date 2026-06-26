import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const { capsuleId, recipientEmail } = await request.json();
  if (!capsuleId || !recipientEmail) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data: capsule } = await supabase
    .from("capsules")
    .select("id, title, owner_id")
    .eq("id", capsuleId)
    .single();

  if (!capsule || capsule.owner_id !== userData.user.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: recipientEmail,
    options: { redirectTo: `${siteUrl}/app/capsula/${capsuleId}` },
  });

  if (linkError || !linkData.user) {
    return NextResponse.json({ error: linkError?.message ?? "Não foi possível gerar o acesso" }, { status: 500 });
  }

  await admin.from("profiles").upsert({ id: linkData.user.id, email: recipientEmail });
  await admin
    .from("capsules")
    .update({ recipient_id: linkData.user.id, recipient_email: recipientEmail })
    .eq("id", capsuleId);

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Cápsula do Tempo <contato@capsuladotempo.com>",
      to: recipientEmail,
      subject: "Você recebeu uma Cápsula do Tempo de presente!",
      html: `<p>Olá!</p><p>Alguém especial criou a cápsula do tempo <strong>${capsule.title}</strong> e te deu acesso completo a ela. Você pode guardar fotos, vídeos e cartas junto com quem te presenteou, até a data de abertura.</p><p><a href="${linkData.properties.action_link}">Acessar a cápsula</a></p>`,
    });
  }

  return NextResponse.json({ ok: true });
}
