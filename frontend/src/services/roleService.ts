import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

type UserRole = "user" | "admin";

type UserProfile = {
  uid: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
};

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data().role as UserRole;
}

export async function createUserProfile(
  uid: string,
  email: string,
  username: string,
  role: UserRole = "user"
): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    username,
    role,
    createdAt: new Date().toISOString(),
  } satisfies UserProfile);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}
