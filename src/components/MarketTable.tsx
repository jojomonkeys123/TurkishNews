import { getPiyasaTablolari } from "@/lib/market";
import MarketTableClient from "./MarketTableClient";

export default async function MarketTable() {
  const tablolar = await getPiyasaTablolari();
  return <MarketTableClient initial={tablolar} />;
}
