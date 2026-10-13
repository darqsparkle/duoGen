"use client";

import { getAuth, onAuthStateChanged, signOut as fbSignOut, type User } from "firebase/auth";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { firebaseApp, isFirebaseConfigured } from "@/lib/firebase/client";
import type { Role, UserProfile } from "@/lib/portal/model";

type PortalState = {
  /** undefined while loading, null when signed out. */
  user: User | null | undefined;
  /** undefined while loading, null when the signed-in user has no profile. */
  profile: UserProfile | null | undefined;
  signOut: () => Promise<void>;
  /** fetch() to the portal API with the signed-in user's ID token attached. */
  api: (path: string, init?: RequestInit) => Promise<Response>;
  can: (...roles: Role[]) => boolean;
};

const PortalContext = createContext<PortalState | null>(null);

export function usePortal() {
  const value = useContext(PortalContext);
  if (!value) throw new Error("usePortal must be used inside <PortalProvider>.");
  return value;
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(getAuth(firebaseApp()), setUser);
  }, []);

  // Live profile: role or active changes made by an admin apply immediately.
  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      doc(getFirestore(firebaseApp()), "users", user.uid),
      (snap) => setProfile(snap.exists() ? (snap.data() as UserProfile) : null),
      () => setProfile(null),
    );
  }, [user]);

  const signOut = useCallback(async () => {
    await fbSignOut(getAuth(firebaseApp()));
    setProfile(undefined);
  }, []);

  const api = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const token = await user?.getIdToken();
      return fetch(path, {
        ...init,
        headers: { "content-type": "application/json", ...(init.headers ?? {}), authorization: `Bearer ${token}` },
      });
    },
    [user],
  );

  const value = useMemo<PortalState>(
    () => ({
      user: isFirebaseConfigured ? user : null,
      profile: user === null ? null : profile,
      signOut,
      api,
      can: (...roles) => Boolean(profile?.active && roles.includes(profile.role)),
    }),
    [user, profile, signOut, api],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}
