import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ hata: "Geçerli bir e-posta adresi girin." }, { status: 400 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    return NextResponse.json(
      { hata: "Bülten kaydı şu anda kullanılamıyor, lütfen daha sonra tekrar deneyin." },
      { status: 503 }
    );
  }

  try {
    const { error } = await resend.contacts.create({ email, audienceId });
    if (error) {
      return NextResponse.json({ hata: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ hata: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
  }
}
