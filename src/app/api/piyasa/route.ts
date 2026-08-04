import { NextResponse } from "next/server";
import { getPiyasaOzetVerisi, getPiyasaTablolari } from "@/lib/market";

export async function GET() {
  const [ozet, tablolar] = await Promise.all([getPiyasaOzetVerisi(), getPiyasaTablolari()]);
  return NextResponse.json(
    { ozet, ...tablolar, guncelleme: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
