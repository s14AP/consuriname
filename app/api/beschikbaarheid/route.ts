import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { vrijeSloten } from "@/lib/beschikbaarheid";

// Beschikbaarheid verandert bij elke boeking: nooit cachen.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const datum = new URL(request.url).searchParams.get("datum");

  if (!datum || !/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
    return NextResponse.json(
      { error: "Geef een datum mee als ?datum=JJJJ-MM-DD" },
      { status: 400 }
    );
  }

  const payload = await getPayload({ config });
  return NextResponse.json(await vrijeSloten(payload, datum));
}
