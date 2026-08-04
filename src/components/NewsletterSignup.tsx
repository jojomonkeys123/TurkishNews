"use client";

import { useState } from "react";
import { EnvelopeSimple } from "@phosphor-icons/react";

type Durum = "hazir" | "gonderiliyor" | "basarili" | "hata";

export default function NewsletterSignup() {
  const [durum, setDurum] = useState<Durum>("hazir");
  const [hataMesaji, setHataMesaji] = useState("");
  const [email, setEmail] = useState("");

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setDurum("gonderiliyor");
    setHataMesaji("");

    try {
      const res = await fetch("/api/abone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const sonuc = await res.json();
      if (!res.ok) {
        setHataMesaji(sonuc.hata || "Bir hata oluştu.");
        setDurum("hata");
        return;
      }
      setDurum("basarili");
      setEmail("");
    } catch {
      setHataMesaji("Bağlantı hatası, lütfen tekrar deneyin.");
      setDurum("hata");
    }
  }

  return (
    <section id="bulten" className="max-w-[1400px] mx-auto px-4 py-6 scroll-mt-20">
      <div className="bg-slate-950 rounded-xl px-6 py-10 md:px-12 text-center">
        <EnvelopeSimple size={28} className="text-red-500 mx-auto mb-3" />
        <h2 className="text-white text-xl md:text-2xl font-bold mb-2">
          Haftalık Bültenimize Abone Olun
        </h2>
        <p className="text-slate-400 text-sm max-w-[480px] mx-auto mb-6">
          Her Pazartesi, geçen haftanın öne çıkan ekonomi ve piyasa haberlerini e-postanıza
          gönderelim.
        </p>

        {durum === "basarili" ? (
          <p className="text-emerald-400 text-sm font-medium">
            Kaydınız alındı, teşekkürler! Bir sonraki bültende görüşürüz.
          </p>
        ) : (
          <form
            onSubmit={gonder}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-[420px] mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              className="w-full flex-1 px-4 py-2.5 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={durum === "gonderiliyor"}
              className="btn-subscribe w-full sm:w-auto shrink-0 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {durum === "gonderiliyor" ? "Gönderiliyor…" : "Abone Ol"}
            </button>
          </form>
        )}
        {durum === "hata" && <p className="text-red-400 text-xs mt-3">{hataMesaji}</p>}
      </div>
    </section>
  );
}
