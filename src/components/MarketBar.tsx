import { getPiyasaOzetVerisi } from "@/lib/market";
import MarketBarClient from "./MarketBarClient";

export default async function MarketBar() {
  const markets = await getPiyasaOzetVerisi();
  return <MarketBarClient initial={markets} />;
}
