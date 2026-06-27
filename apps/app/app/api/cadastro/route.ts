import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const { nome, email, password } = await request.json();
  if (!nome || !email || !password) {
    return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: payment } = await admin
    .from("payments")
    .select("id")
    .eq("email", email)
    .eq("status", "paid")
    .is("user_id", null)
    .maybeSingle();

  if (!payment) {
    return NextResponse.json(
      { error: "Não encontramos um pagamento confirmado para este e-mail." },
      { status: 402 }
    );
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nome },
  });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Não foi possível criar sua conta." },
      { status: 500 }
    );
  }

  await admin.from("profiles").insert({ id: created.user.id, nome, email });
  await admin.from("payments").update({ user_id: created.user.id }).eq("id", payment.id);

  return NextResponse.json({ ok: true });
}
