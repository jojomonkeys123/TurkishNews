import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { ad, email, mesaj } = await req.json();

  if (!ad || !email || !mesaj) {
    return NextResponse.json({ hata: "Tüm alanları doldurun." }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ hata: "Geçerli bir e-posta adresi girin." }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || "EkonomiHaber <bulten@ekonomihaber.com>",
      to: process.env.CONTACT_EMAIL || "iletisim@ekonomihaber.com",
      replyTo: email,
      subject: `İletişim formu: ${ad}`,
      text: `Gönderen: ${ad} <${email}>\n\n${mesaj}`,
    });
    return NextResponse.json({ basarili: true });
  } catch {
    return NextResponse.json({ hata: "Mesaj gönderilemedi, lütfen daha sonra tekrar deneyin." }, { status: 500 });
  }
}
