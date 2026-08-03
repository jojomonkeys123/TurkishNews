"use client";

import { useState } from "react";

type Durum = "hazir" | "gonderiliyor" | "basarili" | "hata";

export default function IletisimForm() {
  const [durum, setDurum] = useState<Durum>("hazir");
  const [hataMesaji, setHataMesaji] = useState("");

  async function gonder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDurum("gonderiliyor");
    setHataMesaji("");

    const form = e.currentTarget;
    const veri = {
      ad: (form.elements.namedItem("ad") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      mesaj: (form.elements.namedItem("mesaj") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(veri),
      });
      const sonuc = await res.json();
      if (!res.ok) {
        setHataMesaji(sonuc.hata || "Bir hata oluştu.");
        setDurum("hata");
        return;
      }
      setDurum("basarili");
      form.reset();
    } catch {
      setHataMesaji("Bağlantı hatası, lütfen tekrar deneyin.");
      setDurum("hata");
    }
  }

  if (durum === "basarili") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded p-4 text-emerald-800 text-sm">
        Mesajınız alındı, teşekkürler. En kısa sürede dönüş yapacağız.
      </div>
    );
  }

  return (
    <form onSubmit={gonder} className="space-y-4">
      <div>
        <label htmlFor="ad" className="block text-sm font-medium text-slate-700 mb-1">
          Ad Soyad
        </label>
        <input
          id="ad"
          name="ad"
          type="text"
          required
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
      <div>
        <label htmlFor="mesaj" className="block text-sm font-medium text-slate-700 mb-1">
          Mesajınız
        </label>
        <textarea
          id="mesaj"
          name="mesaj"
          required
          rows={5}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      {durum === "hata" && (
        <p className="text-sm text-red-600">{hataMesaji}</p>
      )}

      <button
        type="submit"
        disabled={durum === "gonderiliyor"}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded transition-colors"
      >
        {durum === "gonderiliyor" ? "Gönderiliyor…" : "Gönder"}
      </button>
    </form>
  );
}
