"use client";

import { useState } from "react";
import { WhatsappLogo, XLogo, FacebookLogo, LinkSimple, Check } from "@phosphor-icons/react";

export default function ShareButtons({ url, baslik }: { url: string; baslik: string }) {
  const [kopyalandi, setKopyalandi] = useState(false);

  async function linkiKopyala() {
    try {
      await navigator.clipboard.writeText(url);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {
      // pano erişimi yoksa sessizce geç
    }
  }

  const kodlanmisBaslik = encodeURIComponent(baslik);
  const kodlanmisUrl = encodeURIComponent(url);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-slate-400 font-medium mr-1">Paylaş:</span>
      <a
        href={`https://wa.me/?text=${kodlanmisBaslik}%20${kodlanmisUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp'ta paylaş"
        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
      >
        <WhatsappLogo size={16} weight="fill" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${kodlanmisBaslik}&url=${kodlanmisUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X'te paylaş"
        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white transition-colors"
      >
        <XLogo size={14} weight="bold" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${kodlanmisUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook'ta paylaş"
        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
      >
        <FacebookLogo size={16} weight="fill" />
      </a>
      <button
        onClick={linkiKopyala}
        aria-label="Linki kopyala"
        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        {kopyalandi ? <Check size={16} weight="bold" /> : <LinkSimple size={16} />}
      </button>
    </div>
  );
}
