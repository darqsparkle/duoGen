import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb, directoryCard, errorResponse, HttpError, requireRole } from "@/lib/firebase/admin";
import { normalizeUsername, validateUserInput, type UserInput } from "@/lib/portal/model";

/** Edit a portal user (admin only). Password is optional — set it to reset. */
export async function PATCH(request: Request, ctx: RouteContext<"/api/portal/users/[uid]">) {
  try {
    const { uid: adminUid } = await requireRole(request, ["admin"]);
    const { uid } = await ctx.params;
    const body = (await request.json().catch(() => null)) as UserInput | null;
    if (!body) throw new HttpError(400, "Invalid request.");

    const errors = validateUserInput(body, false);
    if (Object.keys(errors).length) return Response.json({ error: "Please fix the highlighted fields.", errors }, { status: 400 });

    // Never let an admin lock themselves out.
    if (uid === adminUid && (body.role !== "admin" || body.active === false)) {
      throw new HttpError(400, "You can't remove your own admin access or deactivate yourself.");
    }

    const db = adminDb();
    const userRef = db.collection("users").doc(uid);
    const current = (await userRef.get()).data();
    if (!current) throw new HttpError(404, "User not found.");

    const username = normalizeUsername(body.username);
    const active = body.active !== false;

    // Check the new username before touching the Auth account, so a clash
    // can't leave Auth and the profile out of sync.
    if (username !== current.username && (await db.collection("usernames").doc(username).get()).exists) {
      throw new HttpError(409, "That username is already taken.");
    }

    await adminAuth().updateUser(uid, {
      email: body.email.trim(),
      emailVerified: true,
      displayName: body.name.trim(),
      disabled: !active,
      ...(body.password ? { password: body.password } : {}),
    });

    await db.runTransaction(async (tx) => {
      if (username !== current.username) {
        const nextRef = db.collection("usernames").doc(username);
        if ((await tx.get(nextRef)).exists) throw new HttpError(409, "That username is already taken.");
        tx.create(nextRef, { uid });
        tx.delete(db.collection("usernames").doc(current.username));
      }
      tx.update(userRef, {
        name: body.name.trim(),
        username,
        email: body.email.trim().toLowerCase(),
        sex: body.sex,
        role: body.role,
        tagline: body.tagline.trim(),
        active,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: adminUid,
      });
      tx.set(
        db.collection("directory").doc(uid),
        directoryCard({ uid, name: body.name.trim(), username, tagline: body.tagline.trim(), role: body.role, active }),
      );
    });

    // Signed-in sessions of a deactivated user end immediately.
    if (!active) await adminAuth().revokeRefreshTokens(uid);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof HttpError && error.status === 409) {
      return Response.json({ error: error.message, errors: { username: "Already taken." } }, { status: 409 });
    }
    return errorResponse(error);
  }
}

/** Delete a portal user (admin only, not yourself). */
export async function DELETE(request: Request, ctx: RouteContext<"/api/portal/users/[uid]">) {
  try {
    const { uid: adminUid } = await requireRole(request, ["admin"]);
    const { uid } = await ctx.params;
    if (uid === adminUid) throw new HttpError(400, "You can't delete your own account.");

    const db = adminDb();
    const userRef = db.collection("users").doc(uid);
    const current = (await userRef.get()).data();
    if (!current) throw new HttpError(404, "User not found.");

    await adminAuth().deleteUser(uid).catch((error) => {
      if ((error as { code?: string }).code !== "auth/user-not-found") throw error;
    });
    const batch = db.batch();
    batch.delete(userRef);
    batch.delete(db.collection("directory").doc(uid));
    if (current.username) batch.delete(db.collection("usernames").doc(current.username));
    await batch.commit();
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
