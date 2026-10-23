import { getOpenings } from "@/lib/careers";

export const dynamic = "force-dynamic";

/** How many roles are open; the site shows its Careers link only when there are some. */
export async function GET() {
  const openings = await getOpenings();
  return Response.json(
    { count: openings.length },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } },
  );
}
