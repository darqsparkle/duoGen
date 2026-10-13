import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb, errorResponse, HttpError, requireRole } from "@/lib/firebase/admin";
import { normalizeUsername, validateUserInput, type UserInput } from "@/lib/portal/model";

/** Create a portal user (admin only): Auth account + profile + unique username. */
export async function POST(request: Request) {
  try {
    const { uid: adminUid } = await requireRole(request, ["admin"]);
    const body = (await request.json().catch(() => null)) as UserInput | null;
    if (!body) throw new HttpError(400, "Invalid request.");

    const errors = validateUserInput(body, true);
    if (Object.keys(errors).length) return Response.json({ error: "Please fix the highlighted fields.", errors }, { status: 400 });

    const db = adminDb();
    const username = normalizeUsername(body.username);
    const usernameRef = db.collection("usernames").doc(username);
    if ((await usernameRef.get()).exists) {
      return Response.json({ error: "That username is already taken.", errors: { username: "Already taken." } }, { status: 409 });
    }

    const authUser = await adminAuth().createUser({
      email: body.email.trim(),
      password: body.password,
      displayName: body.name.trim(),
      disabled: body.active === false,
    });

    try {
      const profile = {
        uid: authUser.uid,
        name: body.name.trim(),
        username,
        email: body.email.trim().toLowerCase(),
        sex: body.sex,
        role: body.role,
        tagline: body.tagline.trim(),
        active: body.active !== false,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        createdBy: adminUid,
      };
      // Claim the username and write the profile together, or not at all.
      await db.runTransaction(async (tx) => {
        if ((await tx.get(usernameRef)).exists) throw new HttpError(409, "That username is already taken.");
        tx.create(usernameRef, { uid: authUser.uid });
        tx.create(db.collection("users").doc(authUser.uid), profile);
      });
      return Response.json({ uid: authUser.uid }, { status: 201 });
    } catch (error) {
      // Don't leave an Auth account without a profile behind.
      await adminAuth().deleteUser(authUser.uid).catch(() => {});
      throw error;
    }
  } catch (error) {
    return errorResponse(error);
  }
}
