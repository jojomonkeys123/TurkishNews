"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ANAHTAR = "anchormedya-cerez-onay";

export default function CookieConsent() {
  const [gorunur, setGorunur] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(ANAHTAR)) {
      setGorunur(true);
    }
  }, []);

  function onayla() {
    localStorage.setItem(ANAHTAR, "kabul");
    setGorunur(false);
  }

  if (!gorunur) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-950 border-t border-slate-800 px-4 py-4">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed flex-1">
          Sitemizde deneyiminizi iyileştirmek ve reklamları kişiselleştirmek için çerezler
          kullanıyoruz. Siteyi kullanmaya devam ederek{" "}
          <Link href="/gizlilik" className="text-red-400 hover:text-red-300 underline">
            Gizlilik ve Çerez Politikamızı
          </Link>{" "}
          kabul etmiş olursunuz.
        </p>
        <button
          onClick={onayla}
          className="shrink-0 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
        >
          Anladım
        </button>
      </div>
    </div>
  );
}
