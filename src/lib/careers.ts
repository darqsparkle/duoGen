import { WORK_TYPES, type Career, type WorkType } from "@/lib/portal/model";

type RestValue = { stringValue?: string; timestampValue?: string };
type RestDocument = { name: string; fields?: Record<string, RestValue> };

/**
 * Open roles for the public site, read through the Firestore REST API (the
 * rules allow public reads of `careers`). REST keeps the Firebase SDK out of
 * the server bundle, which matters on Cloudflare Workers. Newest first.
 * Returns an empty list when Firebase isn't configured or the read fails, so
 * the careers page and link simply stay hidden.
 */
export async function getOpenings(): Promise<Career[]> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) return [];

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/careers?pageSize=100&key=${apiKey}`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      console.error("[careers] read failed", response.status);
      return [];
    }
    const { documents = [] } = (await response.json()) as { documents?: RestDocument[] };
    return documents
      .map((d) => {
        const f = d.fields ?? {};
        const text = (key: string) => f[key]?.stringValue ?? "";
        const workType = text("workType") as WorkType;
        const updated = f.updatedAt?.timestampValue;
        return {
          id: d.name.split("/").pop() ?? "",
          title: text("title"),
          description: text("description"),
          pay: text("pay"),
          workType: WORK_TYPES.includes(workType) ? workType : "on-site",
          location: text("location"),
          updatedAt: updated ? new Date(updated) : null,
        };
      })
      .sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
  } catch (error) {
    console.error("[careers] read failed", error);
    return [];
  }
}
