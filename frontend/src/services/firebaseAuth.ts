import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function loginWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logout() {
  await signOut(auth);
}

export async function getIdToken(user: User): Promise<string> {
  return user.getIdToken();
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}
