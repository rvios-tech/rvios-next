import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

/**
 * The unified backend calls this after a store is suspended, reactivated, edited or deleted, so the
 * cached page (including a "not found" cached while it was suspended) is rebuilt on the next visit.
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET ?? "";
  const given = req.headers.get("x-revalidate-secret") ?? "";
  if (!secret || given.length !== secret.length || !timingSafeEqual(Buffer.from(given), Buffer.from(secret))) {
    return Response.json({ ok: false }, { status: 403 });
  }
  const { slug } = (await req.json().catch(() => ({}))) as { slug?: unknown };
  if (typeof slug !== "string" || !/^[a-z0-9-]{3,40}$/.test(slug)) return Response.json({ ok: false }, { status: 400 });
  revalidateTag(`store:${slug}`);
  revalidatePath(`/s/${slug}`, "layout");
  return Response.json({ ok: true });
}
