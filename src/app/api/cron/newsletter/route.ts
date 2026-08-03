import { NextRequest, NextResponse } from "next/server";
import { main } from "../../../../../scripts/weekly-newsletter.mjs";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_AUDIENCE_ID) {
    return NextResponse.json(
      { ok: false, error: "RESEND_AUDIENCE_ID not set — newsletter skipped" },
      { status: 200 }
    );
  }

  try {
    await main();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
